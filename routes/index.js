var express = require('express'),
		router = express.Router();
		User = require('../models/user'),
		Item = require('../models/item')		

router.get("/", function(req, res){
	res.redirect("index");
});

// Overview (when a get request to /overview comes in, it will run isLoggedin function. If succeeded, run next which is Item.find)
router.get("/overview", isLoggedIn, function(req, res){
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
router.get("/contract", isLoggedIn, function(req, res){
	res.render("contract")
})
// NEW ITEM FORM
router.get("/overview/new", isLoggedIn, function(req, res){
	res.render("new");
})
// ERROR ROUTE
router.get("/err", function(req, res){
	res.render("err");
})
// CREATE ITEM ROUTE
router.post("/overview", isLoggedIn, function(req, res){
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
router.get("/overview/:id", isLoggedIn, function(req, res){
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
router.get("/overview/:id/edit", function(req, res){
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
router.put("/overview/:id", function(req, res){
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
router.delete("/overview/:id", function(req, res){
	Item.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
			res.redirect("/err");
		}else{
			res.redirect("/overview");
		}
	})
})

//isLoggedIn: middleware function we defined
function isLoggedIn (req, res, next){
	if(req.isAuthenticated()){
		return next();
	} res.redirect('/login');
}

module.exports = router;