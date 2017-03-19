//CREATE ITEM
router.post("/overview", isLoggedIn, function(req, res){
	Item.create(req.body.item, function(err, item){
		User.findOne({username: req.user.username}, function(err, foundUser){
			if(err){
			console.log(err);
			res.redirect("/err");
		}else{
			/*console.log("user with the item: "+req.user.username)
			item.user.id = req.user._id;*/
			item.username = req.user.username
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

router.post("/overview", isLoggedIn, function(req, res){
	User.findOne({username: req.user.username}, function(err, foundUser){
			if(err){
			console.log(err);
			res.redirect("/err");
		}else{
			Item.create(req.body.item, function(err, item){
				if(err){
					console.log(err);
					res.redirect("/err");
				}else{
					foundUser.items.push(item);
					foundUser.save();
					res.redirect("/overview");
				}
			})
		}
	})
})