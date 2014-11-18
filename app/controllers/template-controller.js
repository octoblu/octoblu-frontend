var _         = require('lodash');
var Template  = require('../models/template-model');

var TemplateController = function () {
  var self = this;

  self.create = function(req, res) {
    Template.createByUserUUID(req.user.resource.uuid, req.body).then(function(template){
      res.send(201, template);
    }, function(error) {
      res.send(422, error);
    });
  };

  self.findOne = function(req, res) {
    var query = {
      uuid: req.params.id
    };
    return Template.findOne(query).then(function(template) {
      res.send(200, template);
    }, function(error) {
      res.send(404, error);
    });
  }

  self.withFlowId = function(req, res) {
    Template.withFlowId(req.params.flowId).then(function(templates) {
      res.send(200, templates);
    }, function(error) {
      res.send(422, error);
    });
  }

  self.delete = function(req, res) {
    Template.remove({uuid: req.params.id}).then(function() {
      res.send(200);
    }, function(error) {
      res.send(422, error);
    });
  }
};


module.exports = TemplateController;
