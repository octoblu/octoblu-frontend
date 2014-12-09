'use strict';
var fs   = require('fs');
var when = require('when');
var _    = require('lodash');

var channels = JSON.parse(fs.readFileSync('assets/json/channels.json'));

function convertIdToString(id){
  if(id && !_.isString(id)){
    return id.toString();
  }else{
    return id;
  }
}

var Channel = {

  findById: function(id){
    return when(_.findWhere(channels, {_id: convertIdToString(id) }));
  },

  findByIds: function(ids){
    ids = _.map(ids, convertIdToString);
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
    return _.findWhere(channels, {_id: convertIdToString(id) });
  },

  syncFindByType: function(type){
    return _.findWhere(channels, {type: type});
  },

  syncFindOauthConfigByType: function(type) {
    var channel = Channel.syncFindByType(type);
    return channel.oauth[process.env.NODE_ENV] || channel.oauth.development;
  },

  syncMatchByType: function(prefix){
    var re = new RegExp('^' + prefix);
    return _.where(channels, function(channel){
      return re.test(channel.type);
    });
  }

};

module.exports = Channel;
