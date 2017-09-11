let mongoose = require('mongoose');
const Schema = mongoose.Schema;

var geocacheSchema = mongoose.Schema({
		  formattedAddress: String,
    	country: String,
	    countryCode: String,
	    city: String,
	    zipcode: String,
	    streetName: String,
	    streetNumber: String,
	    coords: {
	    	type: [Number],
	    	index: '2dsphere'
	    },
	    provider: String,
	    expires: Number
});


var Geocache = mongoose.model('Geocache', geocacheSchema);
module.exports = Geocache
