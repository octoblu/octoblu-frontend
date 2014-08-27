var _        = require('lodash');
var when     = require('when');
var mongoose = require('mongoose');

var ChannelCollection = function(userUUID, options){
  var self = this;

  options  = options || {};
  mongoose = options.mongoose || mongoose;
  var Api  = mongoose.model('Api');
  var User = mongoose.model('User');

  self.fetch = function() {
    var userApis;
    return self.getUser().then(function(user){
      var channelIds;

      userApis   = user.api;
      channelIds = _.compact(_.pluck(userApis, 'channelid'));

      return self.fetchByIds(channelIds);
    }).then(function(apis){
      return self.mergeChannelsAndApis(userApis, apis);
    });
  };

  self.getUser = function() {
    return User.findLeanBySkynetUUID(userUUID);
  };

  self.fetchByIds = function(channelIds) {
    return Api.findByIds(channelIds);
  };

  self.mergeChannelsAndApis = function(channels, apis){
    return _.map(apis, function(api){
      var channel = _.findWhere(channels, {channelid: ""+api._id});
      return {
        channelid : api._id,
        channelActivationId : channel._id,
        name : api.name,
        type : api.type
      };
    });
  };

  return self;
};

module.exports = ChannelCollection;
