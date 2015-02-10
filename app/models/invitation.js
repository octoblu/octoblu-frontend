'use strict';

var octobluDB = require('../lib/database');
var _ = require('lodash');

function InvitationModel(){
  var collection = octobluDB.getCollection('invitations');
  var methods = {
    findByUuid: function(uuid, callback){
      var self = this;
      self.findOne({ uuid : uuid }, function(error, invitations){
        callback(error, _.first(invitations));
      });
    }
  };
  var Invitation = _.extend({}, collection, methods);
	return Invitation;
}

module.exports = new InvitationModel();
