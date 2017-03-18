var mongoose = require('mongoose');
		passportLocalMongoose = require('passport-local-mongoose');

// User schema
var UserSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	username: String,
	password: String,
	date: {type: Date, default: Date.now},
})
//take the passportLocalMongoose package and add methods that come with the package to UserSchema
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema);