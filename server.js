var express = require('express'),
		app = express(),
		mongoose = require('mongoose'),
		methodOverride = require('method-override')
		cookieParser = require('cookie-parser'),
		bodyParser = require('body-parser'),
		passport = require('passport'),
		LocalStratey = require('passport-local'),
		passportLocalMongoose = require('passport-local-mongoose'),
		Item = require("./models/item"),
		User = require('./models/user');

//APP CONFIG
mongoose.connect("mongodb://localhost/home_v2");
app.set('view engine', 'ejs')
app.set('view cache', false);
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use("/public", express.static('public'))
app.use(methodOverride("_method"))
//use what we're requiring and executing with three options in one clean swoop
app.use(require('express-session')({
	secret: "this is secret!", //used to encode and decode sessions.
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//reading the session and getting data from the session
//passportLocalMongoose already defined serializeUser functions for us!
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// PAGE ROUTING
app.get("/", function(req, res){
	res.redirect("index");
});
// Landing Page
app.get("/index", function(req, res){
	res.render("index")
})
// Payment Overview
app.get("/overview", function(req, res){
		Item.find({}, function(err, items){
		if(err){
			console.log("error!");
		}else{
			res.render("overview", {items:items})
		}
	})
})
// Contract
app.get("/contract", function(req, res){
	res.render("contract")
})
// Form to add a new item
app.get("/overview/new", function(req, res){
	res.render("new");
})
// Error page
app.get("/err", function(req, res){
	res.render("err");
})
// CREATE ROUTE
app.post("/overview", function(req, res){
	console.log("data: "+req.body.item)
	Item.create(req.body.item, function(err, newItem){
		if(err){
			res.redirect("/err");
		}else{
			res.redirect("/overview");
		}
	});
});

// SHOW ROUTE
app.get("/overview/:id", function(req, res){
	Item.findById(req.params.id, function(err, foundItem){
		if(err){
			res.redirect("/err");
		}else{
			res.render("show", {item: foundItem});
		}
	})
})

// EDIT ROUTE
app.get("/overview/:id/edit", function(req, res){
	Item.findById(req.params.id, function(err, foundItem){
		if(err){
			res.redirect("/err");
		}else{
			res.render("edit", {item: foundItem});
		}
	})
})

// UPDATE ROUTE
app.put("/overview/:id", function(req, res){
	Item.findByIdAndUpdate(req.params.id, req.body.item, function(err, updatedItem){
		if(err){
			res.redirect("/err");
		}else{
			res.redirect("/overview/"+req.params.id);
		}
	})
})

// DELETE ROUTE
app.delete("/overview/:id", function(req, res){
	Item.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/err");
		}else{
			res.redirect("/overview");
		}
	})
})




app.listen(3001, function(){
	console.log("payment app working!")
})

