const express = require('express'),
	  router = express.Router(),
	  User = require('../models/user'),
	  passport = require('passport');	


// SIGN-UP ROUTE
router.get("/index", function(req, res){
	res.render("index");
})
// SIGN-UP LOGIC
router.post("/index", function(req, res){
	var newUser = new User({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		username: req.body.username,
		date: req.body.date
	})
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
// ERROR ROUTE
router.get("/err", function(req, res){
	res.render("err");
})
// LOGIN ROUTE
router.get("/login", function(req, res){
	res.render("login")
})
// Login logic: app.post("/login", middleware, callback)
//when a request comes in to login with post method, the passport middle runs first
router.post("/login", passport.authenticate("local", {
	successRedirect: "/overview",
	failureRedirect: "/err"
}), function(req, res){
});

// LOGOUT ROUTE
router.get("/logout", function(req, res){
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

module.exports = router;