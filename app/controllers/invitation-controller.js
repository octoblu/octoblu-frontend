var _ = require('lodash'),
  request = require('request');

var InvitationController = function (options) {
  var self;
  self = this;

  self.requestInvite = function (req, res) {
    var betaUrl = options.baseUrl + '/betas/' + options.betaId + '/testers.json?api_key=' + options.apiKey;
    var betaTesterData = {
        tester : {
          email : req.body.email,
          profile : {
            first_name: req.body.first,
            last_name : req.body.last
          }
        }
    };

    request({
      url: betaUrl,
      method: 'POST',
      json: betaTesterData,
    }, function (error, response, body) {
      if (error) {
        res.send(500, error);
      } else {
        res.send(response.statusCode);
      }
    });
  };
};

module.exports = InvitationController;
