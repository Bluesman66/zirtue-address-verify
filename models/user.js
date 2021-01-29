const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
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
			timezone: {
				type: String,
				default: 'title',
			},
			device_token: {
				type: String,
				default: 'title',
			},
			platform: {
				type: String,
				default: 'title',
			},
		},
	],
	firstName: {
		type: String,
		default: '',
	},
	lastName: {
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
	password: {
		type: String,
		require: true,
		minlength: [6, 'Passward should not be less than 6'],
	},
	phone_number: {
		type: String,
		default: '',
	},
	country_code: {
		type: String,
		default: '',
	},
	forgotId: {
		type: String,
		required: false,
		default: '',
	},
	forgotDate: {
		type: Date,
		required: false,
		default: '1970-01-01T00:00:00',
	},
	admin_access: {
		type: Boolean,
		required: true,
		default: false,
	},
	admin_read_only: {
		type: Boolean,
		required: false,
		default: true,
	},
	user_type: {
		type: String,
		required: false,
		default: 'admin',
	},
	businessPartnerId: {
		type: String,
		required: false,
		default: '',
	},
	isActive: {
		type: Boolean,
		required: true,
		default: true,
	},
	changedPassword: {
		type: Boolean,
		required: false,
		default: false,
	},
	isTwoFactor: {
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
	isPhoneNumberVerified: {
		type: Boolean,
		default: false,
	},
	uuid: {
		type: String,
		required: true,
	},
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
