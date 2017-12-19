const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
mongoose.connect('mongodb://localhost:27017/property_db',{
	useMongoClient: true,
});
let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));

const schema = mongoose.Schema;
let property_schema = new schema({
	property_name: {type: String},
	mobile_no: {type: Number, min: 10},
	description: {type: String, min: 10},
	email: {type: String},
	photo: {type: String},
	city: {type: String},
	district: {type: String},
	state: {type: String}
});

let property_model = mongoose.model('property', property_schema);

app.get('/', function(req, res) {
	res.send('Hello World')
})

app.post('/api/add-property', function(req, res) {
	console.log(req.body);

	if(!req.body.property_name || !req.body.mobile_no || !req.body.description || !req.body.email || !req.body.photo || !req.body.city || !req.body.district || !req.body.state) {
		console.log('missing values');
		return res.json({
			success: false
		});
	}

	const newProperty = new property_model({
		property_name: req.body.property_name,
		mobile_no: req.body.mobile_no,
		description: req.body.description,
		email: req.body.email,
		photo: req.body.photo,
		city: req.body.city,
		district: req.body.district,
		state: req.body.state
	});

	newProperty.save(err => {
		if(err) {
			return res.json({
				success: false
			})
		}

		return res.json({
			success: true
		})
	});
});

app.get('/api/list-properties', function(req, res) {
	property_model.find( function(err, properties) {
		if(err) return console.log(err);
		console.log(properties);
		res.send(properties);
	})
});

app.listen(3000, () => console.log('Listening on 3000!'));
