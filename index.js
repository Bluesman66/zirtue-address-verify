const config = require('./config.json');
const mongoose = require('mongoose');
const axios = require('axios');
const BusinessPartner = require('./models/business_partner');
const Customer = require('./models/customer');

const DEF_DELAY = 100;
const DEF_ATTEMPTS = 3;

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
	let enumTimerId = setTimeout(function nextDoc() {
		businessPartnerCursor
			.next()
			.then((doc) => {
				clearTimeout(enumTimerId);
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

				let attempts = 1;
				let verifyTimerId = setTimeout(function verifyAdd() {
					client
						.post('address-verification', {
							address_street: address1,
							address_city: city,
							address_subdivision: state,
							address_country_code: 'US',
							address_postal_code: postalCode,
						})
						.then((result) => {
							clearTimeout(verifyTimerId);
							const { deliverability } = result.data;
							if (deliverability !== 'usps_deliverable') {
								businessPartnersInvalidAddresses.push({ _id, firstName, lastName });
							}
							console.log(`${firstName} ${lastName} ${deliverability}`);
							delay = DEF_DELAY;
							enumTimerId = setTimeout(nextDoc, delay);
						})
						.catch((e) => {
							businessPartnersInvalidAddresses.push({ _id, firstName, lastName });
							console.log(`Address Verification Error: ${e.message} = ${firstName} ${lastName}`);
							if (attempts < DEF_ATTEMPTS) {
								attempts++;
								delay *= 2;
								verifyTimerId = setTimeout(verifyAdd, delay);
							} else {
								clearTimeout(verifyTimerId);
								delay = DEF_DELAY;
								enumTimerId = setTimeout(nextDoc, delay);
							}
						});
				}, delay);
			})
			.catch((e) => {
				console.log(`Cursor Enumeration Error: ${e.message}`);
				if (e.driver) {
					clearTimeout(enumTimerId);
					console.log(`Business Partners With Invalid Addresses: ${businessPartnersInvalidAddresses.length}`);
					process.exit(0);
				} else {
					delay = DEF_DELAY;
					enumTimerId = setTimeout(nextDoc, delay);
				}
			});
	}, delay);
})();
