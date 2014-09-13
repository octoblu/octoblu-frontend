var _       = require('lodash');
var when    = require('when');
var request = require('request');

var VERIFY_TESTER_TEMPLATE = _.template('https://octoblu.prefinery.com/api/v2/betas/4829/testers/<%= testerId %>/verify.json');
var ACCESS_TOKEN = 'UrswKVa4CaC6aaXtN6Zh';

var Prefinery = function(){
  var self = this;
  self.request = request;

  self.getTester = function(options) {
    if(!options || !options.testerId) {
      return when.reject('must be called with testerId and invitationCode');
    }

    var requestParams = {
      url: VERIFY_TESTER_TEMPLATE(options),
      qs: {access_token : ACCESS_TOKEN, invitation_code: options.invitationCode }
    };

    return when.promise(function(resolve, reject){
      return resolve(requestParams);
      self.request(requestParams, function(err, res, body) {
        if(err) {
          return reject(err);
        }
        resolve(body);
      });
    });
  };

}

module.exports =  Prefinery;
