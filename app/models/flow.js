'use strict';
var octobluDB = require('../lib/database');
var _         = require('lodash');
var when      = require('when');
var request   = require('request');
var configAuth = require('../../config/auth');

function FlowModel() {
  var collection = octobluDB.getCollection('flows');

  var methods = {
    createByUserUUID : function (userUUID, flowData, meshblu) {
      var self = this;
      return registerFlow(meshblu, userUUID).then(function (device) {
        var data = mergeFlowData(userUUID, flowData, device);
        return self.insert(data).then(function () {
          return data;
        });
      });
    },

    deleteByFlowIdAndUser : function (flowId, userUUID, userToken, meshblu) {
      var query, self;
      var FlowDeploy = require('./flow-deploy');
      self = this;
      query = {flowId: flowId};

      return self.findOne(query).then(function (flow) {
        FlowDeploy.stop(userUUID, flow, meshblu);
        return unregisterFlow(meshblu, flow.flowId, userUUID, userToken).then(function () {
          return self.remove(query, true);
        });
      });
    },

    updateByFlowIdAndUser : function (flowId, userUUID, flowData) {
      var self = this;
      var query = {flowId: flowId, 'resource.owner.uuid': userUUID};

      return self.findOne(query).then(function(flow) {
        if (!flow) {
          throw new Error('Flow not found', flowId);
        }
        return _.extend({}, flow, flowData);
      }).then(function(newFlow){
        return self.update(query, newFlow);
      });
    },

    getFlows : function (userUUID) {
      var self = this;
      return self.find({'resource.owner.uuid': userUUID});
    },

    getFlow : function (flowId) {
      var self = this;
      return self.findOne({'flowId': flowId});
    }
  };

  return _.extend({}, collection, methods);
}

var registerFlow = function (meshblu, userUUID) {
  return when.promise(function (resolve, reject) {
    var device = {
      owner: userUUID, 
      type: 'octoblu:flow',
      sendWhitelist: [userUUID],
      receiveWhitelist: [userUUID],
      configureWhitelist: [userUUID]
    }
    meshblu.register(device, function (data) {
      resolve(data);
    });
  });
};

var unregisterFlow = function (meshblu, flowId, uuid, token) {
  var self, uri, params;
  self = this;
  uri = 'http://' + configAuth.skynet.host + ':' + configAuth.skynet.port + '/devices/' + flowId;

  params = {
    uri: uri,
    json: true,
    method: 'delete',
    headers: {
      'meshblu_auth_uuid': uuid,
      'meshblu_auth_token': token
    }
  };

  return when.promise(function (resolve, reject) {
    request(params, function(error, response, body){
      if(error){
        return reject(error);
      }
      if(response.statusCode !== 200){
        return reject(body);
      }

      return resolve(body);
    });
  });
};

var mergeFlowData = function (userUUID, flowData, device) {
  var data = {
    flowId: device.uuid,
    token: device.token,
    name: flowData.name || ('Flow ' + device.uuid.substr(0, 8)),
    resource: {
      nodeType: 'flow',
      owner: {
        uuid: userUUID,
        nodeType: 'user'
      }
    }
  };
  return _.extend({}, flowData, data);
};

module.exports = new FlowModel();
