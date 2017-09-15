'use strict';
let EventEmitter = require('events').EventEmitter;
let mongoose = require('mongoose');
let util = require('util');
let geocache = require('./geo.model.js');

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
  this.maxDistance = options.maxDistance || 20; //Default 20m for Max Distance
  this.resultLimit = options.resultLimit || 1; // Result Limit to one

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
          console.log("READY")
            self.emit('ready', "Geocacher Mongo Database Ready");

        }
    });
  }else if(this.mode === 'redis'){
    self.emit('error', "Redis Database Not Available!");
  }else {
    self.emit('error', "Geocacher Database Not Available!");
  }

};


GeoCacher.prototype.saveGeoCache = function(geo,cb){

  if(this.mode === 'mongodb'){

  }else if(this.mode === 'redis'){
    cb("REDIS Not Implimented")
  }

}

GeoCacher.prototype.reverseGeoCode = function(latitude,longitude,cb){

  if(this.mode === 'mongodb'){
    var point = {
            type: "Point",
            coordinates: [longitude, latitude]
        };
    var geoOptions =  {
        spherical: true,
        maxDistance: this.maxDistance,
        num: this.resultLimit
        };
    geocache.geoNear(point, geoOptions, function(err, results, stats) {
        var locations;
        if (err) {
            cb(err)
        } else {
            cb(results)
        }
    });
  }else if(this.mode === "redis"){

  }

}
module.exports = GeoCacher;
