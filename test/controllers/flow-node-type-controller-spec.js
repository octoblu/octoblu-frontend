var FlowNodeTypeController = require('../../app/controllers/flow-node-type-controller');

describe('FlowNodeTypeController', function () {
  var sut, response;

  beforeEach(function () {
    response = new Response();
    sut = new FlowNodeTypeController();
  });

  it('should instantiate', function () {
    expect(sut).to.exist;
  });

  describe('when getFlowNodeTypeCollection returns a FlowNodeTypeCollection ', function () {
    var stub, flowNodeTypeCollection;

    beforeEach(function () {
      flowNodeTypeCollection = new FlowNodeTypeCollection();
      stub = sinon.stub(sut, 'getFlowNodeTypeCollection');
      stub.returns(flowNodeTypeCollection);
    });

    it('should be a function', function () {
      var request = { user : {resource : {uuid : '1234'}}};
      sut.getFlowNodeTypes(request, response);
    });

    it('should call getFlowNodeTypeCollection with user uuid', function () {
      var request = { user : {resource : {uuid : '1234'}}};
      sut.getFlowNodeTypes(request, response);
      expect(sut.getFlowNodeTypeCollection).to.have.been.calledWith('1234');
    });

    it('should call fetch on the flowNodeTypeCollection', function () {
      var request = { user : {resource : {uuid : '1234'}}};
      sut.getFlowNodeTypes(request, response);
      expect(flowNodeTypeCollection.fetch).to.have.been.called;
    });

    describe('when fetch resolves with some items', function () {
      beforeEach(function () {
        var request = { user : {resource : {uuid : '1234'}}};
        sut.getFlowNodeTypes(request, response);
        flowNodeTypeCollection.fetch.successCallback([{uuid: '1234'}]);
      });

      it('should call response.send with a 200', function () {
        expect(response.send).to.have.been.calledWith(200);
      });

      it('should add in the resourceType', function () {
        var item = _.first(response.send.firstCall.args[1]);
        expect(item).to.have.property('resourceType');
        expect(item.resourceType).to.equal('flow-node-type');
      });
    });
  });
});

var FlowNodeTypeCollection = function(){
  var self = this;
  self.fetch = sinon.spy(function(){
    return {
      then: function(successCallback){
        self.fetch.successCallback = successCallback;
      }
    };
  });
  self.fetch.successCallback = function(){};
  return self;
};

var Response = function(){
  this.send = sinon.spy();
  return this;
};
