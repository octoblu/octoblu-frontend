var FlowDeploy = require('../../app/models/flow-deploy');
var _ = require('lodash');

describe('FlowDeploy', function () {
  var FakeRequest, mongoose;

  before(function(done){
    mongoose   = require('mongoose');
    var UserSchema = require('../../app/models/user');
    var ApiSchema  = require('../../app/models/api');
    var db = mongoose.createConnection();
    User = db.model('User', UserSchema);
    Api  = db.model('Api', ApiSchema);
    db.open('localhost', 'octoblu_test', done);
  });

  beforeEach(function () {
    FakeRequest = {
      post: sinon.spy()
    };
  });

  describe('convertFlow', function () {
    var sut, getUser;
    beforeEach(function () {
      sut = new FlowDeploy();

      getUser = sinon.stub(sut, 'getUser', function (userId) {
        return when.resolve({api:[]});
      });
    });

    describe('when it is called with one flow with no nodes or links', function () {
      it('should return a converted flow', function () {
        var flow = {flowId: '1234', name: 'mah flow', nodes:[], links: []};
        expect(sut.convertFlow(flow)).to.deep.equal([{id: '1234', label: 'mah flow', type: 'tab'}]);
      });
    });

    describe('when it is called with one flow with one node and no links', function () {
      it('should return a converted flow', function () {
        var node = {"id":"4848bef2.b7b74","category":"operation","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var flow = {flowId: '55235', name: 'mah notha flow', nodes:[node], links: []};

        var convertedNode = {"id":"4848bef2.b7b74","category":"operation","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"55235","wires":[]};
        expect(sut.convertFlow(flow)).to.deep.equal([{id: '55235', label: 'mah notha flow', type: 'tab'}, convertedNode]);
      });
    });

    describe('when it is called with one flow with two node and no links', function () {
      it('should return a converted flow', function () {
        var node1 = {"id":"node1","category":"inject", "type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var node2 = {"id":"node2","category":"debug", "type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var flow = {flowId: 'flowid', name: 'flowname', nodes:[node1, node2], links: []};

        var convertedWorkspace1 = {id: 'flowid', label: 'flowname', type: 'tab'};
        var convertedNode1 = {"id":"node1","category":"inject", "type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[]};
        var convertedNode2 = {"id":"node2","category":"debug", "type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[]};
        expect(sut.convertFlow(flow)).to.deep.equal([convertedWorkspace1, convertedNode1, convertedNode2]);
      });
    });

    describe('when it is called with one flow with two node and one link', function () {
      it('should return a converted flow', function () {
        var node1 = {"id":"node1","category":"inject","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var node2 = {"id":"node2","category":"debug","type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var link = {from: "node1", fromPort: "0", to: "node2", toPort: "0"};
        var flow = {flowId: 'flowid', name: 'flowname', nodes:[node1, node2], links: [link]};

        var convertedWorkspace1 = {id: 'flowid', label: 'flowname', type: 'tab'};
        var convertedNode1 = {"id":"node1","category":"inject","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[['node2']]};
        var convertedNode2 = {"id":"node2","category":"debug","type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[]};
        expect(sut.convertFlow(flow)).to.deep.equal([convertedWorkspace1, convertedNode1, convertedNode2]);
      });
    });

    describe('when it is called with one flow with two node and a link from both ports', function () {
      it('should return a converted flow', function () {
        var node1 = {"id":"node1","category":"inject","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var node2 = {"id":"node2","category":"debug","type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var link1 = {from: "node1", fromPort: "0", to: "node2", toPort: "0"};
        var link2 = {from: "node1", fromPort: "1", to: "node2", toPort: "0"};
        var flow = {flowId: 'flowid', name: 'flowname', nodes:[node1, node2], links: [link1, link2]};

        var convertedWorkspace1 = {id: 'flowid', label: 'flowname', type: 'tab'};
        var convertedNode1 = {"id":"node1","category":"inject","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[['node2'], ['node2']]};
        var convertedNode2 = {"id":"node2","category":"debug","type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[]};
        expect(sut.convertFlow(flow)).to.deep.equal([convertedWorkspace1, convertedNode1, convertedNode2]);
      });
    });

    describe('when it is called with one flow with two node and a link from only the second port', function () {
      it('should return a converted flow', function () {
        var node1 = {"id":"node1","category":"inject","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var node2 = {"id":"node2","category":"debug","type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var link = {from: "node1", fromPort: "1", to: "node2", toPort: "0"};
        var flow = {flowId: 'flowid', name: 'flowname', nodes:[node1, node2], links: [link]};

        var convertedWorkspace1 = {id: 'flowid', label: 'flowname', type: 'tab'};
        var convertedNode1 = {"id":"node1","category":"inject","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[[], ['node2']]};
        var convertedNode2 = {"id":"node2","category":"debug","type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[]};
        expect(sut.convertFlow(flow)).to.deep.equal([convertedWorkspace1, convertedNode1, convertedNode2]);
      });
    });

    describe('dealing with legacy nodes', function () {
      describe('when its called with a button node', function () {
        it('should remap the type to inject', function () {
          var node = {"id":"buttonNode","category":"operation","type":"button","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
          var flow = {flowId: 'flowid', name: 'flowname', nodes:[node], links: []};
          var convertedNode = sut.convertFlow(flow)[1];
          expect(convertedNode.type).to.equal('inject');
        });
      });

      describe('when its called with a interval node', function () {
        it('should remap the type to inject', function () {
          var node = {"id":"intervalNode","category":"operation","type":"interval","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
          var flow = {flowId: 'flowid', name: 'flowname', nodes:[node], links: []};
          var convertedNode = sut.convertFlow(flow)[1];
          expect(convertedNode.type).to.equal('inject');
        });
      });

      describe('when its called with a schedule node', function () {
        it('should remap the type to inject', function () {
          var node = {"id":"scheduleNode","category":"operation","type":"schedule","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
          var flow = {flowId: 'flowid', name: 'flowname', nodes:[node], links: []};
          var convertedNode = sut.convertFlow(flow)[1];
          expect(convertedNode.type).to.equal('inject');
        });
      });
    });
  });

  describe('finalTransformation', function () {
    describe('when the transformations have no matches', function () {
      beforeEach(function(){
        var transformations = {};
        sut = new FlowDeploy({transformations: transformations});
      });

      it('should pass the node through', function () {
        expect(sut.finalTransformation({foo: 'bar'})).to.deep.equal({foo: 'bar'});
      });
    });

    describe('when the transformations has a match', function () {
      beforeEach(function(){
        var schanelTransformation = function(node){
          node.schanel = 'lenahcs';
          return node;
        }
        var transformations = {schanel: schanelTransformation};
        sut = new FlowDeploy({transformations: transformations});
      });

      it('should alter the node', function () {
        expect(sut.finalTransformation({blarg: 'jorb', schanel: 'lenahcs', type: 'schanel'})).to.deep.equal({blarg : 'jorb', schanel: 'lenahcs', type : 'schanel'});
      });
    });
  });

  describe('mergeFlowTokens', function () {
    var sut, fakeMeshblu, getUser;

    beforeEach(function () {
      fakeMeshblu = new FakeMeshblu();
      sut = new FlowDeploy({meshblu: fakeMeshblu, userUUID: 'useruuid'});
      getUser = sinon.stub(sut, 'getUser', function (userId) {
        return when.resolve({});
      });
    });

    describe('when a flow', function(){
      var result;
      beforeEach(function () {
        var flow = {nodes: [{category:'channel', channelActivationId:'222222222222', channelid: '111111111111'}]};
        var userApis = [{_id: mongoose.Types.ObjectId('222222222222'), oauth:{access_token: 'this-is-a-token'}}];
        var channelApis = [{_id: mongoose.Types.ObjectId('111111111111'), application: {base: 'http://api.com'}, oauth:{access_token: 'this-is-a-token'}}];
        result = sut.mergeFlowTokens(flow, userApis, channelApis);
      });

      it('should merge the api values into the flow', function(){
        expect(JSON.stringify(_.first(result.nodes))).to.deep.equal(
          JSON.stringify({"category":"channel","channelActivationId":"222222222222","channelid":"111111111111","oauth":{"access_token":"this-is-a-token"},"application":{"base":"http://api.com"}})
        );
      });
    });
  });

  describe('registerFlow', function () {
    var sut, fakeMeshblu;

    beforeEach(function () {
      fakeMeshblu = new FakeMeshblu();
      sut = new FlowDeploy({meshblu: fakeMeshblu, userUUID: 'useruuid'});
    });

    describe('when a flow', function(){
      beforeEach(function () {
        sut.registerFlow('hello.world');
      });

      it('should call register', function () {
        expect(fakeMeshblu.register).to.have.been.calledOnce;
      });

      it('should call register with the flowId', function () {
        expect(fakeMeshblu.register).to.have.been.calledWith({uuid: 'hello.world', type: 'octoblu:flow', owner: 'useruuid'});
      });
    });

    describe('when another flow', function(){
      beforeEach(function () {
        sut.registerFlow('else');
      });

      it('should call register with the flowId', function () {
        expect(fakeMeshblu.register).to.have.been.calledWith({uuid: 'else', type: 'octoblu:flow', owner: 'useruuid'});
      });
    });
  });
});

var FakeMeshblu = function(){
  var _this = this;
  _this.register = sinon.spy();
  _this.devices  = sinon.spy(function(arg0, callback){
    callback({});
  });
  _this.message = sinon.spy();
  return _this;
};
