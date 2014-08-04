var mongoose = require('mongoose');

module.exports = function(options) {
  options = options || {};
  var Flow = options.Flow || mongoose.model('Flow');

  this.updateOrCreate = function(req, res) {
    Flow.updateOrCreateByFlowIdAndUser(req.params.id, req.user.skynet.uuid, req.body).then(function(){
      res.send(204);
    }, function(error) {
      res.send(422, error);
    });
  };

  this.getAllFlows = function(req, res) {
    res.send([
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
      ]);
  };

  return this;
};
