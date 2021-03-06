'use strict'

let EventEmitter = require('events').EventEmitter
let mongoose = require('mongoose')
let util = require('util')
let geocache = require('./geo.model.js')
const _ = require('lodash')


mongoose.Promise = global.Promise

let requiredOptions = [
  'mode', //mongodb or redis
  'dbURL'
]

function geocacherError(message) {
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name
  this.message = (message || '')
}
util.inherits(geocacherError, Error)

const validate = options => {
  requiredOptions.forEach(function(option) {
    if (!options[option]) {
      throw new Error(`Missing GeoCacher option ${option}`)

    }
  })
} // End Validate options if required options are available if not throw error


function GeoCacher(options) {
  validate(options)
  this.mode = options.mode
  this.dbURL = options.dbURL
  this.maxDistance = options.maxDistance || 20 //Default 20m for Max Distance
  this.resultLimit = options.resultLimit || 1 // Result Limit to one
}
util.inherits(GeoCacher, EventEmitter)

GeoCacher.initialize = function(options) {
  return new GeoCacher(options)
}

GeoCacher.prototype.start = function() {
  var self = this

  if (this.mode === 'mongodb') {
    mongoose.connect(this.dbURL, {
      useMongoClient: true
    }, function(err, db) {
      if (err) {
        self.emit('error', "Mongo Database Not Available!")
      } else {
        self.emit('ready', "Geocacher Mongo Database Ready")

      }
    })
  } else if (this.mode === 'redis') {
    self.emit('error', 'Redis Database Not Available!')
  } else {
    self.emit('error', 'Geocacher Database Not Available!')
  }

}


GeoCacher.prototype.saveGeoCache = function(geo, callback) {
  var body = _.pick(geo, ['coords', 'provider', 'full_address', 'street_number', 'street', 'city', 'municipality2', 'municipality', 'country', 'countryCode', 'postal_code'])
  let Geocache = new geocache(body)

  if (this.mode === 'mongodb') {
    Geocache.save()
      .then(waitForIndex)
      .then(geocache => callback(null, geocache))
      .catch(error => callback(error))
  } else if (this.mode === 'redis') {
    callback(new Error('REDIS Not Implemented'))
  }
}

GeoCacher.prototype.reverseGeoCode = function(longitude, latitude, callback) {
  if (this.mode === 'mongodb') {
    let coords = {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
    let geoOptions = {
      spherical: true,
      maxDistance: this.maxDistance,
      num: this.resultLimit
    }
    geocache.geoNear(coords, geoOptions, function(error, results, stats) {
      if (error) {
        callback(error)
      } else {
        if (results.length == 0) {
          callback(new Error('No Result'))
        } else {
          callback(null, results)
        }
      }
    })
  } else if (this.mode === 'redis') {

  }
}

function waitForIndex() {
  return new Promise((resolve, reject) => {
    geocache.on('index', error => error ? reject(error) : resolve())
  })
}

module.exports = GeoCacher