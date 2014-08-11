var _  = require('underscore');
var mongoose = require('mongoose');
var FlowDeploy = require('../../app/models/flow-deploy');

describe('FlowDeploy', function () {
  var FakeRequest;

  beforeEach(function () {
    FakeRequest = {
      post: sinon.spy()
    };
  });

  describe('convertFlows', function () {
    var sut;
    beforeEach(function () {
      sut = new FlowDeploy();
    });

    describe('when it is called with nothing', function () {
      it('should return an empty array', function () {
        expect(sut.convertFlows()).to.deep.equal([]);
      });
    });

    describe('when it is called with one flow with no nodes or links', function () {
      it('should return a converted flow', function () {
        var flow = {flowId: '1234', name: 'mah flow', nodes:[], links: []};
        expect(sut.convertFlows([flow])).to.deep.equal([{id: '1234', label: 'mah flow', type: 'tab'}]);
      });
    });

    describe('when it is called with one flow with one node and no links', function () {
      it('should return a converted flow', function () {
        var node = {"id":"4848bef2.b7b74","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var flow = {flowId: '55235', name: 'mah notha flow', nodes:[node], links: []};

        var convertedNode = {"id":"4848bef2.b7b74","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"55235","wires":[]};
        expect(sut.convertFlows([flow])).to.deep.equal([{id: '55235', label: 'mah notha flow', type: 'tab'}, convertedNode]);
      });
    });

    describe('when it is called with one flow with two node and no links', function () {
      it('should return a converted flow', function () {
        var node1 = {"id":"node1","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var node2 = {"id":"node2","type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var flow = {flowId: 'flowid', name: 'flowname', nodes:[node1, node2], links: []};

        var convertedWorkspace1 = {id: 'flowid', label: 'flowname', type: 'tab'};
        var convertedNode1 = {"id":"node1","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[]};
        var convertedNode2 = {"id":"node2","type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[]};
        expect(sut.convertFlows([flow])).to.deep.equal([convertedWorkspace1, convertedNode1, convertedNode2]);
      });
    });

    describe('when it is called with one flow with two node and one link', function () {
      it('should return a converted flow', function () {
        var node1 = {"id":"node1","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var node2 = {"id":"node2","type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var link = {from: "node1", fromPort: "0", to: "node2", toPort: "0"};
        var flow = {flowId: 'flowid', name: 'flowname', nodes:[node1, node2], links: [link]};

        var convertedWorkspace1 = {id: 'flowid', label: 'flowname', type: 'tab'};
        var convertedNode1 = {"id":"node1","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[['node2']]};
        var convertedNode2 = {"id":"node2","type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[]};
        expect(sut.convertFlows([flow])).to.deep.equal([convertedWorkspace1, convertedNode1, convertedNode2]);
      });
    });

    describe('when it is called with one flow with two node and a link from both ports', function () {
      it('should return a converted flow', function () {
        var node1 = {"id":"node1","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var node2 = {"id":"node2","type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var link1 = {from: "node1", fromPort: "0", to: "node2", toPort: "0"};
        var link2 = {from: "node1", fromPort: "1", to: "node2", toPort: "0"};
        var flow = {flowId: 'flowid', name: 'flowname', nodes:[node1, node2], links: [link1, link2]};

        var convertedWorkspace1 = {id: 'flowid', label: 'flowname', type: 'tab'};
        var convertedNode1 = {"id":"node1","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[['node2'], ['node2']]};
        var convertedNode2 = {"id":"node2","type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[]};
        expect(sut.convertFlows([flow])).to.deep.equal([convertedWorkspace1, convertedNode1, convertedNode2]);
      });
    });

    describe('when it is called with one flow with two node and a link from only the second port', function () {
      it('should return a converted flow', function () {
        var node1 = {"id":"node1","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var node2 = {"id":"node2","type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
        var link = {from: "node1", fromPort: "1", to: "node2", toPort: "0"};
        var flow = {flowId: 'flowid', name: 'flowname', nodes:[node1, node2], links: [link]};

        var convertedWorkspace1 = {id: 'flowid', label: 'flowname', type: 'tab'};
        var convertedNode1 = {"id":"node1","type":"inject","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[[], ['node2']]};
        var convertedNode2 = {"id":"node2","type":"debug", "name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159,"z":"flowid","wires":[]};
        expect(sut.convertFlows([flow])).to.deep.equal([convertedWorkspace1, convertedNode1, convertedNode2]);
      });
    });

    describe('dealing with legacy nodes', function () {
      describe('when its called with a button node', function () {
        it('should remap the type to inject', function () {
          var node = {"id":"buttonNode","type":"button","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
          var flow = {flowId: 'flowid', name: 'flowname', nodes:[node], links: []};
          var convertedNode = sut.convertFlows([flow])[1];
          expect(convertedNode.type).to.equal('inject');
        });
      });

      describe('when its called with a poll node', function () {
        it('should remap the type to inject', function () {
          var node = {"id":"pollNode","type":"poll","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
          var flow = {flowId: 'flowid', name: 'flowname', nodes:[node], links: []};
          var convertedNode = sut.convertFlows([flow])[1];
          expect(convertedNode.type).to.equal('inject');
        });
      });

      describe('when its called with a schedule node', function () {
        it('should remap the type to inject', function () {
          var node = {"id":"scheduleNode","type":"schedule","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"x":167,"y":159};
          var flow = {flowId: 'flowid', name: 'flowname', nodes:[node], links: []};
          var convertedNode = sut.convertFlows([flow])[1];
          expect(convertedNode.type).to.equal('inject');
        });
      });
    });
  });

  describe('deployFlows', function () {
    var sut;

    describe('deploying to designer', function() {
      var fakeMeshblu;

      beforeEach(function () {
        var config = {host: 'http://designer.octoblu.com'};
        fakeMeshblu = new FakeMeshblu();
        sut = new FlowDeploy({config: config, userUUID: '3838', userToken: 'something', request: FakeRequest, port: '1880', meshblu: fakeMeshblu});
      });

      it('should call post on the designer', function () {
        sut.deployFlows([]);
        expect(fakeMeshblu.message).to.have.been.called;
      });
    });
  });

  describe('designerUrl', function (){
    var sut;

    describe('on a port', function () {
      beforeEach(function () {
        var config = {host: 'http://le.octobleau.com'};
        sut = new FlowDeploy({config: config, userUUID: '3838', userToken: 'something', request: FakeRequest, port: '1880'});
      });

      it('should use the redport', function () {
        expect(sut.designerUrl()).equal('http://le.octobleau.com:1880/library/flows');
      });
    });

    describe('on another port and host', function () {
      beforeEach(function () {
        var config = {host: 'http://blew.octo.com'};
        sut = new FlowDeploy({config: config, userUUID: '535', userToken: 'something-else', port: '9999'});
      });

      it('should use the redport', function () {
        expect(sut.designerUrl()).to.equal('http://blew.octo.com:9999/library/flows');
      });
    });
  });

  describe('registerFlows', function () {
    var sut, fakeMeshblu;

    beforeEach(function () {
      fakeMeshblu = new FakeMeshblu();
      sut = new FlowDeploy({meshblu: fakeMeshblu, userUUID: 'useruuid'});
    });

    it('should be have a <function></function>', function () {
      sut.registerFlows();
    });

    describe('when a flow', function(){
      beforeEach(function () {
        sut.registerFlows([{flowId: 'hello.world'}]);
      });

      it('should call register', function () {
        expect(fakeMeshblu.register).to.have.been.calledOnce;
      });

      it('should call register with the flowId', function () {
        expect(fakeMeshblu.register).to.have.been.calledWith({uuid: 'hello.world', type: 'octoblu:flow', owner: 'useruuid'});
      });
    });

    describe('when an owl', function(){
      beforeEach(function () {
        sut.registerFlows([{flowId: 'something'}, {flowId: 'else'}]);
      });

      it('should call register twice', function () {
        expect(fakeMeshblu.register).to.have.been.calledTwice;
      });

      it('should call register with the flowId', function () {
        expect(fakeMeshblu.register).to.have.been.calledWith({uuid: 'something', type: 'octoblu:flow', owner: 'useruuid'});
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
}
