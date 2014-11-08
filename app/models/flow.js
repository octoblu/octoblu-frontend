'use strict';

var octobluDB = require('../lib/database');

var _ = require('lodash');
var when = require('when');

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

    deleteByFlowIdAndUserUUID : function (flowId, userUUID, meshblu) {
      var query, self;
      var FlowDeploy = require('./flow-deploy');
      self = this;
      query = {flowId: flowId};
      console.log('findingOne');

      return self.findOne(query).then(function (flow) {
        FlowDeploy.stop(userUUID, flow, meshblu);
        console.log('stopping');
        return unregisterFlow(meshblu, flow.flowId, flow.token).then(function () {
          console.log(query);
          return self.remove(query, true);
        })
      });
    },

    updateByFlowIdAndUser : function (flowId, userUUID, flowData) {
      var self = this;
      var query = {flowId: flowId, 'resource.owner.uuid': userUUID};

      return self.findOne(query).then(function(flow) {
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
    meshblu.register({owner: userUUID, type: 'octoblu:flow'}, function (data) {
      resolve(data);
    });
  });
};

var unregisterFlow = function (meshblu, flowId, token) {
  return when.promise(function (resolve, reject) {
    meshblu.unregister({uuid: flowId, token: token}, function (data) {
      resolve(data);
    });
  });
};

var mergeFlowData = function (userUUID, flowData, device) {
  var data = {
    flowId: device.uuid,
    token: device.token,
    name: 'Flow ' + device.uuid.substr(0, 8),
    resource: {
      nodeType: 'flow',
      owner: {
        uuid: userUUID,
        nodeType: 'user'
      }
    }
  };
  return _.extend({}, data, flowData);
};

module.exports = new FlowModel();
