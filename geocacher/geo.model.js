`use strict`
let mongoose = require('mongoose');
const Schema = mongoose.Schema;

const geocacheSchema = mongoose.Schema({
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
   created_at: { type: Date, default: Date.now },
});


const Geocache = mongoose.model('Geocache', geocacheSchema);
module.exports = Geocache
