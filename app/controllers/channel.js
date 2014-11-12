'use strict';

var _               = require('lodash');
var Channel         = require('../models/channel');
var isAuthenticated = require('./middleware/security').isAuthenticated;

module.exports = function (app) {
  var pickProperties, whiteListProperties;

  app.get('/api/channels', function (req, res) {
    Channel.findAllPublic().then(function(channels){
      res.send(whiteListProperties(channels));
    });
  });

  app.get('/api/channels/active', isAuthenticated, function (req, res) {
    var channelIds = _.pluck(req.user.api, 'channelid');
    channelIds = _.map(channelIds, function(id){
      if(id && !_.isString(id)){
        return id.toString();
      }else{
        return id;
      }
    });
    Channel.findByIds(channelIds).then(function(channels){
      res.send(whiteListProperties(channels));
    });
  });

  app.get('/api/channels/:id', function (req, res) {
    Channel.findById(req.params.id).then(function(channel){
      res.send(whiteListProperties(channel));
    });
  });

  pickProperties = function(channel){
    return _.pick(channel, '_id', 'name', 'application', 'type', 'auth_strategy', 'defaultParams');
  };

  whiteListProperties = function(channels) {
    if(!_.isArray(channels)) {
      return pickProperties(channels);
    }

    return _.map(channels, pickProperties);
  };
};
