const config = require('./config.json');
const mongoose = require('mongoose');
const axios = require('axios');
const BusinessPartner = require('./models/business_partner');
const Customer = require('./models/customer');

const DEF_DELAY = 1000;

(async function () {
	const businessPartnersInvalidAddresses = [];

	try {
		await mongoose.connect(config.mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true });
	} catch (e) {
		(e) => console.error(`Connecting MongoDB Error: ${e.message}`);
		process.exit(1);
	}

	const client = axios.default.create({
		baseURL: 'https://uat-api.synapsefi.com/v3.1',
		headers: {
			'X-SP-GATEWAY': `${config.clientId}|${config.clientSecret}`,
			'X-SP-USER': '|static_pin',
			'X-SP-USER-IP': '127.0.0.1',
			'Content-Type': 'application/json',
		},
	});

	const businessPartnerCursor = BusinessPartner.find({}).cursor();

	let delay = DEF_DELAY;
	let timerId = setTimeout(function request() {
		businessPartnerCursor
			.next()
			.then((doc) => {
				delay = DEF_DELAY;
				const { _id, firstName, lastName, address1, city, state, postalCode, controller } = doc;
				// const { address } = controller;
				// const {
				// 	address1: _address1,
				// 	address2: _address2,
				// 	city: _city,
				// 	stateProvinceRegion: _stateProvinceRegion,
				// 	country: _country,
				// 	postalCode: _postalCode,
				// } = address;

				client
					.post('address-verification', {
						address_street: address1,
						address_city: city,
						address_subdivision: state,
						address_country_code: 'US',
						address_postal_code: postalCode,
					})
					.then((result) => {
						delay = DEF_DELAY;
						const { deliverability } = result.data;
						if (deliverability !== 'usps_deliverable') {
							businessPartnersInvalidAddresses.push({ _id, firstName, lastName });
						}
						console.log(`${firstName} ${lastName} ${deliverability}`);
					})
					.catch((e) => {
						delay *= 2;
						console.log(`Address Verification Error: ${e.message} = ${firstName} ${lastName}`);
					});
			})
			.catch((e) => {
				delay *= 2;
				console.log(`Cursor Enumeration Error: ${e.message}`);
				if (e.driver) {
					clearTimeout(timerId);
					console.log(`Business Partners With Invalid Addresses: ${businessPartnersInvalidAddresses.length}`);
				}
			});

		timerId = setTimeout(request, delay);
	}, delay);
})();
