'use strict';
const express = require('express');
const GeoCacher = require('./geocacher');
let app = express();



const geoCacher = GeoCacher.initialize({
  'mode'  : 'mongodb',
  'dbURL' : 'mongodb://localhost:27017/logixmapdata',
  'maxDistance': 25, //Required
  'resultLimit':1 // Optional for Mongo

});


geoCacher.on('ready', (status) => {
  geoCacher.reverseGeoCode(121.001651, 14.632906, result => {
    console.log(result)
  });


  let reverseGeo = { provider: 'Google',
  full_address: '645 Banawe St, Santa Mesa Heights, Quezon City, 1114 Metro Manila, Philippines',
  street_number: '645',
  street: 'Banawe Street',
  city: 'Quezon City',
  municipality2: 'Metro Manila',
  municipality: 'Metro Manila',
  country: 'Philippines',
  countryCode: 'PH',
  postal_code: '1114',
  coords: [121.001651,14.632906]}

  // geoCacher.saveGeoCache(reverseGeo, result => {
  //   console.log(result)
  // });

})

geoCacher.on('error', (err) => {
  console.log(err);
});
geoCacher.start()


let server = app.listen(3030);
