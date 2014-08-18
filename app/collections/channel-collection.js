var _        = require('lodash');
var when     = require('when');
var mongoose = require('mongoose');

var Api  = mongoose.model('Api');
var User = mongoose.model('User');

var ChannelCollection = function(userUUID){
  var self = this;

  self.fetch = function() {
    var userApis;
    return self.getUser().then(function(user){
      var channelIds;

      userApis   = user.api;
      channelIds = _.pluck(userApis, 'channelid');

      return self.fetchByIds(channelIds);
    }).then(function(apis){
      return self.mergeChannelsAndApis(userApis, apis);
    });
  };

  self.getUser = function() {
    return User.findBySkynetUUID(userUUID);
  };

  self.fetchByIds = function(channelIds) {
    return Api.findByIds(channelIds);
  };

  self.mergeChannelsAndApis = function(channels, apis){
    return _.map(apis, function(api){
      var channel = _.findWhere(channels, {channelid: api._id});
      return _.defaults(api, channel);
    });
  };

  return self;
};

module.exports = ChannelCollection;
