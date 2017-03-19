var mongoose = require("mongoose"),
		randToken = require('rand-token');

var itemSchema = new mongoose.Schema({
	id: {
		type: String, 
		default: function() {return randToken.generate(6);}
    },
	contractId: {type: String, default: 9999 },
	description: String,
	value: Number,
	//"time": included in date, 
	isImported:false,
	createdAt: Date,
	updatedAt: {type: Date, default: Date.now},
	isDeleted:false,
	author: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			},
			username: String
	}
})

module.exports = mongoose.model("Item", itemSchema);
