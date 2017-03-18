var express = require('express'),
	mongoose = require('mongoose'),
	methodOverride = require('method-override')
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
app.use(methodOverride("_method"))
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

//Payment Overview
app.get("/overview", function(req, res){
		Item.find({}, function(err, items){
		if(err){
			console.log("error!");
		}else{
			res.render("overview", {items:items})
		}
	})
})

// New transaction
app.get("/new", function(req, res){
	res.render("new");
})

// CREATE ROUTE
app.post("/overview", function(req, res){
	//create item
	Item.create(req.body.item, function(err, newItem){
		if(err){
			res.render("new")
		}else{
			res.redirect("/overview");
		}
	});
});

// SHOW ROUTE
app.get("/overview/:id", function(req, res){
	Item.findById(req.params.id, function(err, foundItem){
		if(err){
			res.redirect("/overview");
		}else{
			res.render("show", {item: foundItem});
		}
	})
})

// EDIT ROUTE
app.get("/overview/:id/edit", function(req, res){
	Item.findById(req.params.id, function(err, foundItem){
		if(err){
			res.redirect("/overview");
		}else{
			res.render("edit", {item: foundItem});
		}
	})
})

//UPDATE ROUTE
app.put("/overview/:id", function(req, res){
	Item.findByIdAndUpdate(req.params.id, req.body.item, function(err, updatedItem){
		if(err){
			res.redirect("/overview");
		}else{
			res.redirect("/overview/"+req.params.id);
		}
	})
})

// DELETE ROUTE
app.delete("/overview/:id", function(req, res){
	Item.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/overview");
		}else{
			res.redirect("/overview");
		}
	})
})




app.listen(3001, function(){
	console.log("payment app working!")
})

