var _       = require('lodash');
var when    = require('when');
var request = require('request');
var querystring = require('querystring');

var VERIFY_TESTER_TEMPLATE = _.template('https://octoblu.prefinery.com/api/v2/betas/4829/testers/<%= testerId %>/verify.json');
var CHECK_IN_TESTER_TEMPLATE = _.template('https://octoblu.prefinery.com/api/v2/betas/4829/testers/<%= testerId %>/checkin.json');
var ACCESS_TOKEN = 'UrswKVa4CaC6aaXtN6Zh';

var Prefinery = function(){
  var self = this;
  self.request = request;

  self.checkInTester = function(testerId) {
    if(!testerId) {
      return when.reject('must be called with testerId');
    }

    var requestParams = {
      url: CHECK_IN_TESTER_TEMPLATE({testerId: testerId}),
      method: 'POST',
      qs: {api_key : ACCESS_TOKEN }
    };

    return when.promise(function(resolve, reject){
      self.request(requestParams, function(err, res) {
        if(err) {return reject(err);}

        if(res.statusCode !== 202) {
          return reject({statusCode: res.statusCode, body: res.body});
        }

        resolve();
      });
    });
  };

  self.getTester = function(options) {
    if(!options || !options.testerId || !options.invitationCode) {
      return when.reject('must be called with testerId and invitationCode');
    }

    var requestParams = {
      url: VERIFY_TESTER_TEMPLATE(options),
      qs: {api_key : ACCESS_TOKEN, invitation_code: options.invitationCode }
    };

    return when.promise(function(resolve, reject){
      self.request(requestParams, function(err, res, body) {
        if(err) {return reject(err);}

        if(res.statusCode !== 200) {
          return reject("Invitation Code is invalid.");
        }

        var tester = JSON.parse(body);
        if(tester.invitation_code !== options.invitationCode) {
          return reject("Invitation Code is invalid.");
        }

        if(tester.status !== 'invited') {
          return reject("Invitation Code has already been used.");
        }

        resolve(tester);
      });
    });
  };
};

module.exports =  Prefinery;
