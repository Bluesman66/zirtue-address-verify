const config = require('./config.json');
const mongoose = require('mongoose');
const axios = require('axios');
const BusinessPartner = require('./models/business_partner');
const Customer = require('./models/customer');

(async function () {
	const client = axios.default.create({
		baseURL: 'https://uat-api.synapsefi.com/v3.1',
		headers: {
			'X-SP-GATEWAY': `${config.clientId}|${config.clientSecret}`,
			'X-SP-USER': '|static_pin',
			'X-SP-USER-IP': '127.0.0.1',
			'Content-Type': 'application/json',
		},
	});

	try {
		await mongoose.connect(config.mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true });

		const businessPartnerCursor = BusinessPartner.find({}).cursor();

		businessPartnerCursor
			.next()
			.then((doc) => {
				const { _id, firstName, lastName, address1, city, state, postalCode, controller } = doc;
				const { address } = controller;
				const {
					address1: _address1,
					address2: _address2,
					city: _city,
					stateProvinceRegion: _stateProvinceRegion,
					country: _country,
					postalCode: _postalCode,
				} = address;

				checkAddress({
					address_street: address1,
					address_city: city,
					address_subdivision: state,
					address_country_code: 'US',
					address_postal_code: postalCode,
				});
			})
			.catch((e) => {
				console.log(e.message);
			});

		// const customersCursor = Customer.find({}).cursor();
		// while (true) {
		// 	customersCursor.next((error, doc) => {
		// 		if (error) break;
		// 		console.log(doc);
		// 	});
		// }

		// const businessPartnersInvalidAddresses = await getBusinessPartnersInvalidAddresses();
		// const customersInvalidAddresses = await getCustomersInvalidAddresses();

		// console.log(businessPartnersInvalidAddresses.length);
		// console.log(customersInvalidAddresses.length);
	} catch (e) {
		(e) => console.error(`Connecting MongoDB Error: ${e.message}`);
	}

	function checkAddress({
		address_street,
		address_city,
		address_subdivision,
		address_country_code,
		address_postal_code,
	}) {
		client
			.post('address-verification', {
				address_street,
				address_city,
				address_subdivision,
				address_country_code,
				address_postal_code,
			})
			.then((result) => {
				const { deliverability } = result.data;
				if (deliverability !== 'usps_deliverable') {
				}
			})
			.catch((e) => console.log(`Address Verification Error: ${e.message}`));
	}

	async function getBusinessPartnersInvalidAddresses() {
		const result = [];
		await BusinessPartner.find({}, (err, bps) => {
			if (err) {
				console.log(err.message);
			}

			bps.map((bp) => {
				const { _id, firstName, lastName, address1, city, state, postalCode, controller } = bp;
				const { address } = controller;
				const {
					address1: _address1,
					address2: _address2,
					city: _city,
					stateProvinceRegion: _stateProvinceRegion,
					country: _country,
					postalCode: _postalCode,
				} = address;

				checkAddress(
					{
						address_street: address1,
						address_city: city,
						address_subdivision: state,
						address_country_code: 'US',
						address_postal_code: postalCode,
					},
					_id,
					(id) => result.push(id)
				);
				// addressInvalid({
				// 	address_street: _address1,
				// 	address_city: _city,
				// 	address_subdivision: _stateProvinceRegion,
				// 	address_country_code: _country,
				// 	address_postal_code: _postalCode,
				// });
			});
		});
		return result;
	}

	async function getCustomersInvalidAddresses() {
		const result = [];
		await Customer.find({}, (err, customers) => {
			if (err) {
				console.log(err.message);
			}
			customers.map((customer) => {
				const { _id, firstName, lastName, address1, address2, fullAddress, city, state, postalCode } = customer;

				checkAddress(
					{
						address_street: address1,
						address_city: city,
						address_subdivision: state,
						address_country_code: 'US',
						address_postal_code: postalCode,
					},
					_id,
					(id) => result.push(id)
				);
			});
		});
		return result;
	}
})();
