var express = require('express'),
		router = express.Router();
		User = require('../models/user'),
		Item = require('../models/item')		

router.get("/", function(req, res){
	res.redirect("index");
});

// OVERVIEW: Transaction + current balance
router.get("/overview", isLoggedIn, function(req, res){
	User.findOne({username: req.user.username}).populate("items").exec(function(err, foundUser){
			Item.find({}, function(err, items){
				if(err){
					console.log(err);
					res.redirect("/err");
				}else{
					var counter = 0;
					var userItems = foundUser.items;
					userItems.forEach(function(eachItem){
						if(eachItem.type=='credit'){
							eachItem.value=(eachItem.value)*(-1);
						}
						counter+=eachItem.value;
					})
					res.render("overview", {items: foundUser.items, balance: counter})
				}
			})	
	});
})

// Contract
router.get("/contract", isLoggedIn, function(req, res){
	res.render("contract")
})
// NEW ITEM FORM
router.get("/overview/new", isLoggedIn, function(req, res){
	res.render("new");
})

// CREATE ITEM ROUTE
router.post("/overview", isLoggedIn, function(req, res){
	User.findOne({username: req.user.username}, function(err, foundUser){
			if(err){
			console.log(err);
			res.redirect("/err");
		}else{
			console.log("------",req.body)
			Item.create(req.body.item, function(err, item){
				if(err){
					console.log(err);
					res.redirect("/err");
				}else{
					//add username and id to item 
					item.author.id = req.user._id;
					item.author.username = req.user.username;
					//save item
					item.save();
					foundUser.items.push(item);
					foundUser.save();
					//console.log("created item: "+item)
					res.redirect("/overview");
				}
			})
		}
	})
})

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