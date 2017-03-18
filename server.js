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

//==========================APP CONFIG==========================
mongoose.connect("mongodb://localhost/home_v2");
app.set('view engine', 'ejs')
app.set('view cache', false);
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use("/public", express.static('public'))
app.use(methodOverride("_method"))
// Passport configuration
app.use(require('express-session')({
	secret: "this is secret!", //used to encode and decode sessions.
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
//setting up middleware called authenticate
passport.use(new LocalStratey(User.authenticate())); 
//built-in authentication methods
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//creating my own middleware: we're passing currentUser: req.user to every single handler by calling this function for every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
})

//==========================ROUTES==========================
app.get("/", function(req, res){
	res.redirect("index");
});
// Landing/Sign-up
app.get("/index", function(req, res){
	res.render("index");
})

// Sign-up logic
app.post("/index", function(req, res){
	var newUser = new User({username: req.body.username})
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.redirect("/err");
		}
		passport.authenticate('local')(req, res, function(){
			res.redirect("/overview");
		});
	});
})

// LOGIN ROUTES
app.get("/login", function(req, res){
	res.render("login")
})
// Login logic: app.post("/login", middleware, callback)
//when a request comes in to login with post method, the passport middle runs first
app.post("/login", passport.authenticate("local", {
	successRedirect: "/overview",
	failureRedirect: "/err"
}), function(req, res){
});

// Logout
app.get("/logout", function(req, res){
	//passport is simply destroying the user data in the session
	req.logout();
	res.redirect("/index");
})

//isLoggedIn: middleware function we defined
function isLoggedIn (req, res, next){
	if(req.isAuthenticated()){
		return next();
	} res.redirect('/login');
}

// Overview (when a get request to /overview comes in, it will run isLoggedin function. If succeeded, run next which is Item.find)
app.get("/overview", isLoggedIn, function(req, res){
		Item.find({}, function(err, items){
		if(err){
			console.log(err);
			res.redirect("/err");
		}else{
			res.render("overview", {items:items})
		}
	})
})
// Contract
app.get("/contract", isLoggedIn, function(req, res){
	res.render("contract")
})
// Form to add a new item
app.get("/overview/new", isLoggedIn, function(req, res){
	res.render("new");
})
// ERROR ROUTE
app.get("/err", function(req, res){
	res.render("err");
})
// CREATE ITEM ROUTE
app.post("/overview", isLoggedIn, function(req, res){
	console.log("data: "+req.body.item)
	Item.create(req.body.item, function(err, newItem){
		if(err){
			console.log(err);
			res.redirect("/err");
		}else{
			res.redirect("/overview");
		}
	});
});

// SHOW ITEM ROUTE
app.get("/overview/:id", isLoggedIn, function(req, res){
	Item.findById(req.params.id, function(err, foundItem){
		if(err){
			console.log(err);
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
			console.log(err);
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
			console.log(err);
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
			console.log(err);
			res.redirect("/err");
		}else{
			res.redirect("/overview");
		}
	})
})


app.listen(3001, function(){
	console.log("payment app working!")
})

