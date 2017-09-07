'use strict';
let EventEmitter = require('events').EventEmitter;
let mongoose = require('mongoose');
let util = require('util');

mongoose.Promise = global.Promise;

var requiredOptions = [
    'mode', //mongodb or redis
    'dbURL'
];

function geocacherError(message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = (message || '');
}
util.inherits(geocacherError, Error);

const validate = options => {
  requiredOptions.forEach(function (option) {
   if (!options[option]) {
     throw new Error(`Missing GeoCacher option ${option}`);

   }
  });
} // End Validate options if required options are available if not throw error


function GeoCacher (options) {
  validate(options);
  this.mode = options.mode;
  this.dbURL = options.dbURL;
}
util.inherits(GeoCacher, EventEmitter);

GeoCacher.initialize = function (options) {
  return new GeoCacher(options);;
};

GeoCacher.prototype.start = function () {
  var self = this

  if(this.mode === 'mongodb'){
    mongoose.connect(this.dbURL,{ useMongoClient: true }, function(err, db) {
        if (err) {
            self.emit('error', "Mongo Database Not Available!");
        } else {
            self.emit('ready', "Geocacher Mongo Database Ready");
        }
    });
  }else if(this.mode === 'redis'){
    self.emit('error', "Redis Database Not Available!");
  }else {
    self.emit('error', "Geocacher Database Not Available!");
  }

};

module.exports = GeoCacher;
