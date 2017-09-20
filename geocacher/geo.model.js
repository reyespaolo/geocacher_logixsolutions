let mongoose = require('mongoose');
const Schema = mongoose.Schema;

var geocacheSchema = mongoose.Schema({
  provider: String,
  full_address: String,
  street_number:String,
  street: String,
  city: String,
  municipality2: String,
  municipality:String,
  country: String,
  countryCode: String,
  postal_code: String,
	coords: {
	   type: [Number],
	   index: '2dsphere'
	 },
   timestamps: true
});


var Geocache = mongoose.model('Geocache', geocacheSchema);
module.exports = Geocache
