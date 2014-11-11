'use strict';
var request = require('request')

module.exports = function (app) {

  app.all('/api/elastic/skynet_trans_log/_search', function(req, res){
    request({
      url:    'http://54.68.191.122/skynet_trans_log/_search',
      method: req.method,
      json:   req.body
    }, function(error, incomingMessage, response){
      try{
        res.send(incomingMessage.statusCode, response);
      } catch(e){
        console.log("no statusCode on incoming message");
      }
    });
  });
};
