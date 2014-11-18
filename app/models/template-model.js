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
        template.flow = self.cleanFlow(flow);
        return self.insert(template).then(function(){
          return template;
        });
      });
    },

    importTemplate : function(userUUID, templateId, meshblu) {
      var self = this;
      return self.findOne({uuid: templateId}).then(function(template) {
        var newFlow = _.clone(template.flow);
        return Flow.createByUserUUID(userUUID, newFlow, meshblu);
      });
    },

    cleanFlow : function(flow) {
        var self = this;
        var newFlow = _.cloneDeep(flow);

        delete newFlow._id;
        delete newFlow.flowId;
        delete newFlow.resource;

        newFlow.nodes = _.map(newFlow.nodes, self.cleanNode);      
      return newFlow;
    },

    cleanNode : function(node) {
      var self = this;
      console.log("Before ", node);
      var stuffToKeep = ['type', 'category', 'name'];
      _.each(_.keys(node.defaults), function(key){
        if (_.contains(stuffToKeep, key)){
          return ;
        }
        delete node.defaults[key];
        delete node[key];
      });
      console.log("After Butts ", node);
      return node;
    },

    withFlowId : function(flowId) {
      var self = this;
      var query = {
        flowId: flowId
      };
      return self.find(query);
    }
  };

  return _.extend({}, collection, methods);
}

module.exports = new TemplateModel()
