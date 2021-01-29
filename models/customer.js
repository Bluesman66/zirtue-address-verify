const mongoose = require('mongoose');
const validator = require('validator');

const CustomerSchema = new mongoose.Schema({
	uuid: {
		type: String,
		required: true,
	},
	previewName: {
		type: String,
		required: false,
		default: null,
	},
	tokens: [
		{
			access: {
				type: String,
				required: true,
			},
			token: {
				type: String,
				required: true,
				index: true,
			},
			version_number: {
				type: String,
				required: false,
				default: '',
			},
			timezone: String,
			device_token: String,
			platform: String,
		},
	],
	notification_setting: {
		push_notification: {
			bank_transfer: {
				type: Boolean,
				default: true,
			},
			payment_received: {
				type: Boolean,
				default: true,
			},
			payment_sent: {
				type: Boolean,
				default: true,
			},
			payment_request_received: {
				type: Boolean,
				default: true,
			},
		},
		email_notification: {
			bank_transfer: {
				type: Boolean,
				default: true,
			},
			payment_received: {
				type: Boolean,
				default: true,
			},
			payment_sent: {
				type: Boolean,
				default: true,
			},
			payment_request_received: {
				type: Boolean,
				default: true,
			},
		},
		sms_notification: {
			bank_transfer: {
				type: Boolean,
				default: true,
			},
			payment_received: {
				type: Boolean,
				default: true,
			},
			payment_sent: {
				type: Boolean,
				default: true,
			},
			payment_request_received: {
				type: Boolean,
				default: true,
			},
		},
	},
	user_status: {
		type: String,
		default: 'created',
	},
	longitude: {
		type: String,
		default: '',
	},
	latitude: {
		type: String,
		default: '',
	},
	user_status_previous: {
		type: String,
		default: '',
	},
	user_status_date: {
		type: Date,
		default: '1970-01-01T00:00:00',
	},
	notificationCount: {
		type: Number,
		default: 0,
	},

	loan_request_count: {
		type: Number,
		default: 0,
	},
	activity_count: {
		type: Number,
		default: 0,
	},

	reminder_flag: {
		type: Number,
		default: 0,
	},
	NR_flag: {
		type: Number,
		default: 0,
	},
	admin_read_only: {
		type: Boolean,
		default: false,
	},
	country_code: {
		type: String,
		default: '',
	},
	document_count: {
		type: Number,
		default: 0,
	},
	document_uploaded: {
		type: String,
		default: '',
	},
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email',
		},
	},
	profile_picture: {
		type: String,
		default: '',
	},
	customerUrl: {
		type: String,
		default: '',
	},
	firstName: {
		type: String,
		required: true,
		default: '',
	},
	link: {
		type: String,
		default: '',
	},
	lastName: {
		type: String,
		required: true,
		default: '',
	},
	fullName: {
		type: String,
		required: false,
		default: '',
	},
	//type will be verified, unverified or receive-only customers
	type: {
		type: String,
		default: '',
		required: true,
	},
	user_token: {
		type: String,
		default: '',
		required: true,
	},
	admin_access: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: '1970-01-01T00:00:00',
	},
	updatedAt: {
		type: Date,
		default: '1970-01-01T00:00:00',
	},
	deactivated_date: {
		type: Date,
		default: '1970-01-01T00:00:00',
	},

	//First line of the street address of the Customer’s permanent residence. Must be 50 characters or less. Note: PO Boxes are not allowed.
	address1: {
		type: String,
		default: '',
	},
	address2: {
		type: String,
		default: '',
	},
	fullAddress: {
		type: String,
		default: '',
	},
	delete_account_reason: {
		type: String,
		default: '',
	},
	city: {
		type: String,
		default: '',
	},
	//Two letter abbreviation of the state in which the Customer resides, e.g. CA.
	state: {
		type: String,
		default: '',
	},
	field_name: {
		type: String,
		default: '',
	},

	banks: {
		type: Array,
		default: '',
	},

	//Customer’s date of birth in YYYY-MM-DD format. Must be 18 years or older.
	dateOfBirth: {
		type: Date,
		default: '1970-01-01',
	},
	//Last four digits of the Customer’s Social Security Number.
	ssn: {
		type: String,
		default: '',
	},
	//Customer’s 10 digit phone number. No hyphens or other separators, e.g. 3334447777.
	phone_number: {
		type: String,
		//required: true,
		default: '',
	},
	// Business’ US five-digit ZIP or ZIP + 4 code.
	postalCode: {
		type: String,
		default: '',
	},
	institutionName: {
		type: String,
		default: '',
	},
	password: {
		type: String,
		default: '',
	},
	pin: {
		type: String,
		default: '',
	},
	isTwoFactor: {
		type: Boolean,
		default: false,
	},
	isRegistrationWebhook: {
		type: Boolean,
		default: false,
	},
	mobile_name: {
		type: String,
		default: '',
	},
	mobile_os: {
		type: String,
		default: '',
	},
	app_version: {
		type: String,
		default: '',
	},
	device_platform: {
		type: String,
		default: '',
	},
	carrier: {
		type: String,
		default: '',
	},
	ip_address: {
		type: String,
		default: '',
	},
	device_manufacturer: {
		type: String,
		default: '',
	},
	app_name: {
		type: String,
		default: '',
	},
	device_unique_id: {
		type: String,
		default: '',
	},
	sift_decision_date: {
		type: Date,
		default: '1970-01-01T00:00:00',
	},
	sift_decision_code: {
		type: String,
		default: '',
	},
	deciding_party: {
		type: String,
		default: '',
	},
	cronjob_details: {
		previous_status: {
			type: String,
			default: '',
		},
		cronjob_detail: {
			type: Boolean,
			default: false,
		},
		cronjob_date: {
			type: Date,
			default: '1970-01-01T00:00:00',
		},
	},
	customer_buffer_data: {
		type: String,
		default: '',
	},
	is_backup_customer: {
		type: Boolean,
		default: false,
	},
	subscription: [
		{
			sku_id: {
				type: String,
				default: '',
			},
			plan: {
				type: String,
				default: '',
			},
			subscription_date: {
				type: Date,
				default: '1970-01-01T00:00:00',
			},
			expire_subscription_date: {
				type: String,
				default: '',
			},
			server_expire_subscription_date: {
				type: String,
				default: '',
			},
			cancel_subscription_date: {
				type: Date,
				default: '1970-01-01T00:00:00',
			},
			is_subscribe: {
				type: Boolean,
				default: false,
			},
			phone_number: {
				type: String,
				//required: true,
				default: '',
			},
			transaction_id: {
				type: String,
				default: '',
			},
			platform: {
				type: String,
				default: '',
			},
			receipt: {
				type: String,
				default: '',
			},
			original_transaction_id: {
				type: String,
				default: '',
			},
			purchase_date_ms: {
				type: String,
				default: '',
			},
			cancel_reason: {
				type: String,
				default: '',
			},
			cancel_survey_reason: {
				type: String,
				default: '',
			},
			purchase_obj: {
				type: Object,
			},
		},
	],
	cardholderId: {
		type: String,
		default: '',
	},
	synapseId: {
		type: String,
		default: '',
	},
	lastKnownUnsub: {
		type: Number,
		default: 0,
	},
	totalReferralMoney: {
		type: Number,
		default: 0,
		max: 599,
	},
	sentNotificationToContacts: {
		type: Boolean,
		default: false,
	},
	synapse_permission: {
		type: String,
		default: '',
	},
	synapse_cip_tag: {
		type: String,
		default: '',
	},
});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;
