const config = require('./config.json');
const mongoose = require('mongoose');
const axios = require('axios');
const BusinessPartner = require('./models/business_partner');
const Customer = require('./models/customer');

const DEF_DELAY = 100;
const DEF_ATTEMPTS = 3;

(async function () {
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

	const bpCursor = BusinessPartner.find({}).cursor();
	validateModel(
		client,
		bpCursor,
		(doc) => {
			const { id, firstName, lastName, address1, city, state, postalCode } = doc;
			return {
				id: id,
				firstName,
				lastName,
				address_street: address1,
				address_city: city,
				address_subdivision: state,
				address_country_code: 'US',
				address_postal_code: postalCode,
			};
		},
		(collection) => {
			console.log(`Business Partners With Invalid Addresses: ${collection.length}`);
		}
	);

	validateModel(
		client,
		bpCursor,
		(doc) => {
			const { id, firstName, lastName, controller } = doc;
			const { address } = controller;
			const { address1, city, stateProvinceRegion, postalCode } = address;
			return {
				id: id,
				firstName,
				lastName,
				address_street: address1,
				address_city: city,
				address_subdivision: stateProvinceRegion,
				address_country_code: 'US',
				address_postal_code: postalCode,
			};
		},
		(collection) => {
			console.log(`Business Partners With Invalid Addresses: ${collection.length}`);
		}
	);

	const custCursor = Customer.find({}).cursor();
	validateModel(
		client,
		custCursor,
		(doc) => {
			const { id, firstName, lastName, address1, city, state, postalCode } = doc;
			return {
				id,
				firstName,
				lastName,
				address_street: address1,
				address_city: city,
				address_subdivision: state,
				address_country_code: 'US',
				address_postal_code: postalCode,
			};
		},
		(collection) => {
			console.log(`Customers With Invalid Addresses: ${collection.length}`);
		}
	);
})();

function validateModel(client, cursor, extract, eof) {
	const collection = [];
	let delay = DEF_DELAY;
	let enumTimerId = setTimeout(function nextDoc() {
		cursor
			.next()
			.then((doc) => {
				clearTimeout(enumTimerId);
				const {
					id,
					firstName,
					lastName,
					address_street,
					address_city,
					address_subdivision,
					address_country_code,
					address_postal_code,
				} = extract(doc);

				let attempts = 0;
				let verifyTimerId = setTimeout(function verifyAdd() {
					client
						.post('address-verification', {
							address_street,
							address_city,
							address_subdivision,
							address_country_code,
							address_postal_code,
						})
						.then((result) => {
							clearTimeout(verifyTimerId);
							const { deliverability } = result.data;
							if (deliverability !== 'usps_deliverable') {
								collection.push({ id, firstName, lastName });
							}
							console.log(`${firstName} ${lastName} => ${deliverability}`);
							delay = DEF_DELAY;
							enumTimerId = setTimeout(nextDoc, delay);
						})
						.catch((e) => {
							if (attempts < DEF_ATTEMPTS) {
								console.log(`${firstName} ${lastName} => ${e.message}`);
								attempts++;
								delay *= 2;
								verifyTimerId = setTimeout(verifyAdd, delay);
							} else {
								collection.push({ id, firstName, lastName });
								clearTimeout(verifyTimerId);
								delay = DEF_DELAY;
								enumTimerId = setTimeout(nextDoc, delay);
							}
						});
				}, delay);
			})
			.catch((e) => {
				if (e.driver) {
					clearTimeout(enumTimerId);
					eof(collection);
					process.exit(0);
				} else {
					delay = DEF_DELAY;
					enumTimerId = setTimeout(nextDoc, delay);
				}
			});
	}, delay);
}
