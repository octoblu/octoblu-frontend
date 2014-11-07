'use strict';

var octobluDB = require('../lib/database');

function InvitationModel(){
	return octobluDB.getCollection('invitations');
}

module.exports = new InvitationModel();
