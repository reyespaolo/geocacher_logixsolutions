'use strict';
const express = require('express');
const GeoCacher = require('./geocacher');
let app = express();

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

const geoCacher = GeoCacher.initialize({
  'mode'  : 'mongodb',
  'dbURL' : 'mongodb://localhost:27017/logixmapdata',
  'maxDistance': 25, //Required
  'resultSet':1 // Optional for Mongo

});


geoCacher.on('ready', (status) => {//6.381782, 124.689757 //6.384245, 124.690551 //6.384543, 124.690294
  geoCacher.reverseGeoCode(6.384543, 124.690294, function(result){
    console.log(result)
  });

})

geoCacher.on('error', (err) => {
  console.log(err);
});
geoCacher.start()


let server = app.listen(3030);
