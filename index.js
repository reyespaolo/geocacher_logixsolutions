'use strict';
const express = require('express')
let app = express();

const GeoCacher = require('./geocacher');

const geoCacher = GeoCacher.initialize({
  mode: 'mongodb',
  dbURL: '//mondobdURL'
});


geoCacher.on('ready', (status) => {
  console.log(status)
})
geoCacher.start()

let server = app.listen(3030);
