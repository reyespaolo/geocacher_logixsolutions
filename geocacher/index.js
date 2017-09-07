'use strict';

var EventEmitter = require('events').EventEmitter;

let util = require('util');

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
  this.emit('ready', "Database Ready");
};

module.exports = GeoCacher;
