var express = require('express'),
		router = express.Router();
		User = require('../models/user'),
		Item = require('../models/item')		

router.get("/", function(req, res){
	res.redirect("index");
});


/*
router.get("/overview/:id", isLoggedIn, function(req, res){
	Item.findById(req.params.id).populate('items').exec(function(err, foundItem){
		if(err){
			console.log(err);
			res.redirect("/err");
		}else{
			console.log(foundItem);
			res.render("show", {item: foundItem});
		}
	})
})
*/
//Overview
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

//Associating ITEM with USER


// CREATE ITEM ROUTE
router.post("/overview", isLoggedIn, function(req, res){
	Item.create(req.body.item, function(err, item){
		User.findOne({username: req.user.username}, function(err, foundUser){
			if(err){
			console.log(err);
			res.redirect("/err");
		}else{
			/*console.log("user with the item: "+req.user.username)
			item.user.id = req.user._id;
			item.user.username = req.user.username;*/
			foundUser.items.push(item);
			foundUser.save(function(err, data){
				if(err){
					console.log(err);
					res.redirect("/err");
				}else{
					res.redirect("/overview");
				}
			})
			}
		})
	});
});
// ERROR ROUTE
router.get("/err", function(req, res){
	res.render("err");
})
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