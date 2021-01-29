const mongoose = require('mongoose');
const validator = require('validator');
const BP_INTEREST = 5;

const BusinessPartnerSchema = new mongoose.Schema({
	uuid: {
		type: String,
		required: true,
	},
	previewName: {
		type: String,
		required: false,
		default: null,
	},
	firstName: {
		type: String,
		required: true,
		minlength: [3, 'First Name should not be less than 3'],
		default: '',
	},
	lastName: {
		type: String,
		required: true,
		minlength: [3, 'Last Name should not be less than 3'],
		default: '',
	},
	alias: {
		type: String,
		required: false,
		trim: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 5,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email',
		},
	},
	type: {
		type: String,
		default: 'business',
	},
	address1: {
		type: String,
		default: '',
	},
	city: {
		type: String,
		default: '',
	},
	state: {
		type: String,
		default: '',
	},
	postalCode: {
		type: String,
		default: '',
	},
	reasonId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentReason' },
	controller: {
		firstName: {
			type: String,
			default: '',
		},
		lastName: {
			type: String,
			default: '',
		},
		title: {
			type: String,
			default: '',
		},
		dateOfBirth: {
			type: Date,
			required: false,
			default: '1970-01-01T00:00:00',
		},
		ssn: {
			type: String,
			default: '',
		},
		address: {
			address1: {
				type: String,
				default: '',
			},
			address2: {
				type: String,
				default: '',
			},
			city: {
				type: String,
				default: '',
			},
			stateProvinceRegion: {
				type: String,
				default: '',
			},
			country: {
				type: String,
				default: 'US',
			},
			postalCode: {
				type: String,
				default: '',
			},
		},
	},
	businessClassification: {
		type: String,
		default: '',
	},
	payment_reason_id: {
		type: Number,
		default: 0,
	},
	business_logo: {
		type: String,
		default: '',
	},
	businessType: {
		type: String,
		default: '',
	},
	businessName: {
		type: String,
		default: '',
	},
	ein: {
		type: String,
		default: '',
	},
	website: {
		type: String,
		default: '',
	},
	phone_number: {
		type: String,
		default: '',
	},
	country_code: {
		type: String,
		default: '',
	},
	isPhoneNumberVerified: {
		type: Boolean,
		default: false,
	},
	ssn: {
		type: String,
		default: '',
	},
	dateOfBirth: {
		type: Date,
		required: false,
		default: '1970-01-01T00:00:00',
	},
	password: {
		type: String,
		require: true,
		minlength: [8, 'Passsword should not be less than 8'],
	},
	access_token: {
		type: String,
		default: '',
	},
	verification_code: {
		type: String,
		required: true,
		default: '',
	},
	partner_signup_date: {
		type: Date,
		required: false,
		default: '1970-01-01T00:00:00',
	},
	partner_account_activate_date: {
		type: Date,
		required: false,
		default: '1970-01-01T00:00:00',
	},
	is_activate: {
		type: Boolean,
		default: false,
	},
	is_two_factor: {
		type: Boolean,
		default: false,
	},
	is_business_partner_with_controller: {
		type: Boolean,
		default: false,
	},
	is_business_partner_info: {
		type: Boolean,
		default: false,
	},
	is_beneficial_owner: {
		type: Boolean,
		default: false,
	},
	business_partner_info_date: {
		type: Date,
		required: false,
		default: '1970-01-01T00:00:00',
	},
	is_forgot_status: {
		type: Boolean,
		default: false,
	},
	forgot_expiry_timestamp: {
		type: String,
		default: '',
	},
	forgot_verification_code: {
		type: String,
		default: '',
	},
	customer_url: {
		type: String,
		default: '',
	},
	deep_link: {
		type: String,
		default: '',
	},
	customer_status: {
		type: String,
		default: 'created',
	},
	previous_status: {
		type: String,
		default: '',
	},
	customer_status_date: {
		type: Date,
		required: false,
		default: '1970-01-01T00:00:00',
	},
	previous_status_date: {
		type: Date,
		required: false,
		default: '1970-01-01T00:00:00',
	},
	webhook_status: {
		type: Boolean,
		default: false,
	},
	controller_document: {
		type: String,
		default: '',
	},
	business_document: {
		type: String,
		default: '',
	},
	document_failure_date: {
		type: Date,
		required: false,
		default: '1970-01-01T00:00:00',
	},
	document_failure_reason: {
		type: String,
		default: '',
	},
	document_link_name: {
		type: String,
		default: '',
	},
	payment_refrence_type: {
		type: String,
		default: '',
	},
	zirtue_interest: {
		type: Number,
		default: BP_INTEREST,
	},
	beneficial_owner: [
		{
			status: {
				type: String,
				default: 'created',
			},
			beneficial_status_date: {
				type: Date,
				default: '1970-01-01T00:00:00',
			},
			beneficial_owner_url: {
				type: String,
				default: '',
			},
			beneficial_owner_document: {
				type: String,
				default: '',
			},
			firstName: {
				type: String,
				default: '',
			},
			lastName: {
				type: String,
				default: '',
			},
			dateOfBirth: {
				type: Date,
				required: false,
				default: '1970-01-01T00:00:00',
			},
			ssn: {
				type: String,
				default: '',
			},
			error_message: {
				type: String,
				default: '',
			},
			address: {
				address1: {
					type: String,
					default: '',
				},
				address2: {
					type: String,
					default: '',
				},
				city: {
					type: String,
					default: '',
				},
				stateProvinceRegion: {
					type: String,
					default: '',
				},
				country: {
					type: String,
					default: 'US',
				},
				postalCode: {
					type: String,
					default: '',
				},
			},
		},
	],
	news_read_time: {
		type: Date,
		required: false,
		default: '1970-01-01T00:00:00',
	},
	available_without_accounts: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const BusinessPartner = mongoose.model('BusinessPartner', BusinessPartnerSchema);

module.exports = BusinessPartner;
