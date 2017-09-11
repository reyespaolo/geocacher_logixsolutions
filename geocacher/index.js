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
  this.maxDistance = options.maxDistance || 1; //Default 1 km for Max Distance
  this.resultSet = options.resultSet;

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


GeoCacher.prototype.reverseGeoCode = function(latitude,longitude,cb){

  var point = {
          type: "Point",
          coordinates: [longitude, latitude]
      };
  var geoOptions =  {
      spherical: true,
      maxDistance: this.maxDistance,
      num: this.resultSet
      };
  geocache.geoNear(point, geoOptions, function(err, results, stats) {
      var locations;
      if (err) {
          cb(err)
      } else {
          cb(results)
      }
  });
}


module.exports = GeoCacher;


// geocache.find({
// 		coords: {
// 			$near: {
// 				$geometry: { type: 'Point', coordinates: [longitude, latitude] },
// 				$maxDistance: 25
// 			}
// 		}
// 	},
// 	function(err, data) {
//      console.log(data)
//   })


// var limit =  10;
// let coords = [];
// //
// coords[0] = longitude;
// coords[1] = latitude;
//   var location = {
//     [latitude, longitude]
// };


// Location.geoNear([
//    {
//         near: { type: "Point", coordinates: [ latitude, longitude ] },
//         maxDistance: 2,
//         includeLocs: "dist.location",
//         num: 5,
//         spherical: true
//    }
// ]).exec(function(err, locations) {
//   console.log(locations)
// })
// var geoOptions =  {
//   maxDistance: this.maxDistance,
//   num: 10
// }
//
//
//   };
// var point = {
//       'type': "Point",
//       'coordinates': [longitude, latitude]
//   };
//
  // db.runCommand({ "geoNear" : "test", "spherical" : true, "distanceMultiplier" : 0.001, "near" : { "type" : "Point" , "coordinates" : [33.2926487, 44.4159651] } })

// Location.geoNear(point, geoOptions, function(err, results, stats) {
//   console.log(results)
//         // var locations;
//         //
//         // console.log('Geo Results', results);
//         // console.log('Geo stats', stats);
//         // if (err) {
//         //     console.log('geoNear error:', err);
//         //     // sendJsonResponse(res, 404, err);
//         // } else {
//         //     // locations = buildLocationList(req, res, results, stats);
//         //     // sendJsonResponse(res, 200, locations);
//         // }
//     });

// Location.geoNear({
//       loc: {
//         $near : {
//           $geometry:{type:'Point', coordinates:[longitude,latitude]},
//           $maxDistance:50,
//           distanceMultiplier: 3963.2
//
//
//         }
//       }
//     }).exec(function(err,locations){
//       console.log(err)
//     })
  // }).exec(function(err, locations) {
  //   if (err) {
  //     cb(err)
  //   }else{
  //
  //     if(locations != ''){
  //       locations.source = 'Custom Geocacher'
  //       cb(locations)
  //     }else{
  //       cb('No Result Found')
  //     }
  //
  //  }
  // });
// var geoOptions =  {
//       maxDistance: (this.maxDistance)
//   };
//

// Location.geoNear(coords, geoOptions, function(err, results, stats){
//   console.log(results)
//   cb(err)
// });

//   Location.aggregate([
//    {
//      $geoNear: {
//         near: { type: "Point", coordinates: [ coords ] },
//         distanceField: "dist.calculated",
//         maxDistance: 2,
//         query: { type: "public" },
//         includeLocs: "dist.location",
//         num: 5,
//         spherical: true
//      }
//    }
// ])
