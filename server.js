var express = require('express'),
	mongoose = require('mongoose'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	app = express(),
	Item = require("./models/item");

//APP CONFIG
mongoose.connect("mongodb://localhost/home_v2");
app.set('view engine', 'ejs')
app.set('view cache', false);
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use("/public", express.static('public'))
/*
Item.create({
	id: 3,
	contractId: 3,
	description: "Rent",
	value: 2000
})
*/

//Page routing
app.get("/", function(req, res){
	res.redirect("index");
});
app.get("/index", function(req, res){
	res.render("index")
})
app.get("/contract", function(req, res){
	res.render("contract")
})

//Payment History
app.get("/history", function(req, res){
		Item.find({}, function(err, items){
		if(err){
			console.log("error!");
		}else{
			res.render("history", {items:items})
		}
	})
})

// New transaction
app.get("/new", function(req, res){
	res.render("new");
})

// CREATE ROUTE
app.post("/history", function(req, res){
	//create item
	Item.create(req.body.item, function(err, newItem){
		if(err){
			res.render("new")
		}else{
			res.redirect("/history");
		}
	});
});

// SHOW ROUTE
app.get("/history/:id", function(req, res){
	Item.findById(req.params.id, function(err, foundItem){
		if(err){
			res.redirect("/history");
		}else{
			res.render("show", {item: foundItem});
		}
	})
})




app.listen(3001, function(){
	console.log("home app v2 working!")
})

