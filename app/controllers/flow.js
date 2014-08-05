var mongoose = require('mongoose');
var _        = require('underscore');

module.exports = function(options) {
  var _this, Flow;
  _this = this;

  options = options || {};
  Flow = options.Flow || mongoose.model('Flow');

  _this.updateOrCreate = function(req, res) {
    Flow.updateOrCreateByFlowIdAndUser(req.params.id, req.user.skynet.uuid, req.body).then(function(){
      res.send(204);
    }, function(error) {
      res.send(422, error);
    });
  };

  _this.getAllFlows = function(req, res) {
    return _this.getFlows(req.user.skynet.uuid, function(error, flows) {
      if(error){
        return res.send(500, error);
      }
      res.send(flows);
    });
  };

  _this.getFlows = function(userUUID, callback){
    Flow.find({'resource.owner.uuid': userUUID}, function(err, flows){
      flows = [
        {
          name: 'Flow 1',
          nodes: [
            {
              "id": "7b8f181f8470e8",
              "type": "inject",
              "name": "Inject Node",
              "x": 44.8888854980469,
              "y": 181.88888549804688
            },
            {
              "id": "d71fffc928e",
              "type": "debug",
              "name": "Wait a sec",
              "phoneNumber": "aasdsadsad",
              "plivoAuthId": "dsa",
              "plivoAuthToken": "asd",
              "x": 125.888916015625,
              "y": 2.10415649414062
            }
          ],
          links: [
            { "from": '7b8f181f8470e8', fromPort: 0, "to": "d71fffc928e", toPort: 0  }
          ]
        },
        {
          name: 'Bigger Flow',
          "nodes": [
            {
              "id": "aade37cf5521c8",
              "type": "inject",
              "x": 441,
              "y": 233
            },
            {
              "id": "7c5fb40383a04c",
              "type": "debug",
              "x": 744.0000305175781,
              "y": 164
            },
            {
              "id": "955881926aa78",
              "type": "function",
              "x": 600.8888854980469,
              "y": 256.8888854980469
            },
            {
              "id": "7b8f181f8470e8",
              "type": "inject",
              "x": 440.8888854980469,
              "y": 181.88888549804688
            },
            {
              "id": "d71fffc928e",
              "type": "delay",
              "phoneNumber": "aasdsadsad",
              "plivoAuthId": "dsa",
              "plivoAuthToken": "asd",
              "properties": {
                "phoneNumber": "aasdsadsad",
                "plivoAuthId": "dsa",
                "plivoAuthToken": "asd"
              },
              "x": 252.888916015625,
              "y": 251.10415649414062
            }
          ],
          "links": [
            {
              "from": "aade37cf5521c8",
              fromPort: 0,
              "to": "7c5fb40383a04c",
              toPort: 0
            },
            {
              "from": "aade37cf5521c8",
              "fromPort": 0,
              "to": "955881926aa78",
              "toPort": 0
            },
            {
              "from": "955881926aa78",
              "fromPort" : 0,
              "to": "7c5fb40383a04c",
              "toPort" : 0
            },
            {
              "from": "7b8f181f8470e8",
              "fromPort" : 0,
              "to": "7c5fb40383a04c",
              "toPort" : 0
            }
          ]
        }
      ];
      callback(err, _.map(flows, function(flow){
        return flow;
      }));
    });
  };

  return _this;
};
