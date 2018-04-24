const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

// HANDLEBARS MIDDLEWARE
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// BODY PARSER MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// SET STATIC FOLDER
app.use(express.static(`${__dirname}/public`));
//app.use("/public", express.static('public'))

// INDEX ROUTE
app.get('/', (req, res) => {
	res.render('stripe_index', {
		stripePublishableKey: keys.stripePublishableKey
	});
});

// CHARGE ROUTE
app.post('/charge', (req, res)=>{
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

const port = process.env.PORT || '5000';

app.listen(port, () => {
	console.log(`Server started on port ${port}!`);
});