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

// REQUIRE ROUTES
var authRoutes = require('./routes/auth'),
		indexRoutes = require('./routes/index');

// APP CONFIG
mongoose.connect("mongodb://localhost/home_v2");
app.set('view engine', 'ejs')
app.set('view cache', false);
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use("/public", express.static('public'))
app.use(methodOverride("_method"))

// PASSPORT CONFIG
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
app.use(authRoutes);
app.use(indexRoutes);


app.listen(process.env.PORT || '3001'
, function(){
	console.log("payment app working!")
})

