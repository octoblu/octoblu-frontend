'use strict';
var octobluDB  = require('../lib/database');
var _          = require('lodash');
var when       = require('when');
var uuid       = require('node-uuid');
var Flow       = require('./flow');

function TemplateModel() {
  var collection = octobluDB.getCollection('templates');

  var methods = {
    createByUserUUID : function(userUUID, data) {
      var self = this;
      var template = _.extend({
        uuid: uuid.v1(),
        created: new Date(),
        resource: {
          nodeType: 'template',
          owner: {
            uuid: userUUID,
            nodeType: 'user'
          }
        }
      }, data);
      return Flow.findOne({flowId: data.flowId}).then(function(flow) {
        template.flow = flow;
        return self.insert(template).then(function(){
          return template;
        });
      });
    },

    importTemplate : function(userUUID, templateId, meshblu) {
      var self = this;
      return self.findOne({uuid: templateId}).then(function(template) {
        var newFlow = _.clone(template.flow);
        delete newFlow._id;
        delete newFlow.flowId;
        delete newFlow.resource;
        return Flow.createByUserUUID(userUUID, newFlow, meshblu);
      });
    },

    withFlowId : function(flowId) {
      var self = this;
      var query = {
        flowId: flowId
      };
      return self.find(query);
    }
  }

  return _.extend({}, collection, methods);
}

module.exports = new TemplateModel()
