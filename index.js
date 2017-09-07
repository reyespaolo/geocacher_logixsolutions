'use strict';
const express = require('express');
const GeoCacher = require('./geocacher');
let app = express();

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

const geoCacher = GeoCacher.initialize({
  'mode'  : 'mongodb',
  'dbURL' : 'mongodb://localhost:27017/logixmapdata'
});


geoCacher.on('ready', (status) => {
  console.log(status)
})

geoCacher.on('error', (err) => {
  console.log(err);
});
geoCacher.start()

let server = app.listen(3030);
