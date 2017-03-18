var mongoose = require('mongoose');
		passportLocalMongoose = require('passport-local-mongoose');

// User schema
var UserSchema = new mongoose.Schema({
	username: String,
	passport: String
})
//take the passport local mongoose package and add methods that come with the package to UserSchema
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema);