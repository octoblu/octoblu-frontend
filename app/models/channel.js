'use strict';
var fs   = require('fs');
var when = require('when');
var _    = require('lodash');

var channels = JSON.parse(fs.readFileSync('assets/json/channels.json'));

var Channel = {

  findById: function(id){
    return when(_.findWhere(channels, {_id: id}));
  },

  findByIds: function(ids){
    return when(_.filter(channels, function(channel){
      return _.contains(ids, channel._id);
    }));
  },

  findAllByOwnerId: function(ownerId){
    return when(_.where(channels, {owner: ownerId}));
  },

  findAll: function(){
    return when(channels);
  },

  findAllPublic: function(){
    return when(_.filter(channels, function(channel){
      return !channel.owner && channel.enabled;
    }));
  },

  syncFindById: function(id){
    return _.findWhere(channels, {_id: id});
  },

  syncFindByType: function(type){
    return _.findWhere(channels, {type: type});
  }
};

module.exports = Channel;
