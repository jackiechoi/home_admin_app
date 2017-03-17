var mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({
	id: Number,
	contractId:Number,
	description: String,
	value:Number,
	//"time": included in date, 
	isImported:false,
	createdAt: Date,
	updatedAt: {type: Date, default: Date.now},
	isDeleted:false
})

module.exports = mongoose.model("Item", itemSchema);

