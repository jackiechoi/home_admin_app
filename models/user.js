var mongoose = require('mongoose');
	passportLocalMongoose = require('passport-local-mongoose');

// User schema
var UserSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	username: {type: String, required: true},
	password: String,
	date: {type: Date, default: Date.now},
	items: [ 
		{//array of mongoose ObjectIDs belonging to item
			type: mongoose.Schema.Types.ObjectId,
			ref: "Item"
		}
	]
})

//take the passportLocalMongoose package and add methods that come with the package to UserSchema
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema);