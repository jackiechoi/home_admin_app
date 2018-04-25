const express = require('express'),
	  router = express.Router(),
 	  keys = require('../config/keys'),
      stripe = require('stripe')(keys.stripeSecretKey),
 	  bodyParser = require('body-parser')


// INDEX ROUTE
router.get('/stripe', (req, res) => {
	res.render('stripe', {
		stripePublishableKey: keys.stripePublishableKey
	});
});

// CHARGE ROUTE
router.post('/charge', (req, res)=>{
	const amount = 50000;

	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken
	})
	.then(customer => stripe.charges.create({
		amount,
		description: 'rent amount',
		currency: 'eur',
		customer: customer.id
	}))
	.then(charge => res.render('success'));
});

module.exports = router;
