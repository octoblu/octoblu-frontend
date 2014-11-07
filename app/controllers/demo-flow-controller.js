var _ = require('lodash');
var demoFlow = require('../../assets/flows/demo-flow.json');

var DemoFlowController = function (options) {
  var self, meshblu, Flow;
  self = this;

  options = options || {};

  Flow    = options.Flow || require('../models/flow');
  meshblu = options.meshblu;

  self.create = function (req, res) {
    var user = req.user;
    user.overwriteOrAddApiByChannelId('5337a38d76a65b9693bc2a9f', {authtype: 'none'}); //weather
    user.overwriteOrAddApiByChannelId('53275d4841da719147d9e36a', {authtype: 'none'}); //stockprice
    user.overwriteOrAddApiByChannelId('542c2f2eab1c05dde14544e0', {authtype: 'basic', token : user.skynet.uuid, secret : user.skynet.token }); //send_sms
    user.overwriteOrAddApiByChannelId('542ce2ad47a930b1280b0d05', {authtype: 'basic', token : user.skynet.uuid, secret : user.skynet.token}); // email
    user.save(function(){
      Flow.createByUserUUID(user.resource.uuid, demoFlow, meshblu).then(function(flow){
        res.send(201, flow);
      }, function(error) {
        res.send(422, error);
      });
    })
  };
}

module.exports = DemoFlowController;
