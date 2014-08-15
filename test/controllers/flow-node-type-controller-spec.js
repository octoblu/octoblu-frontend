var FlowNodeTypeController = require('../../app/controllers/flow-node-type-controller');

describe('FlowNodeTypeController', function () {
  var sut, fakeResponse;

  beforeEach(function () {
    fakeResponse = new FakeResponse();
    sut = new FlowNodeTypeController();
  });

  it('should instantiate', function () {
    expect(sut).to.exist;
  });

  describe('when getFlowNodeTypeCollection returns a FlowNodeTypeCollection ', function () {
    var stub, fakeFlowNodeTypeCollection;

    beforeEach(function () {
      fakeFlowNodeTypeCollection = new FakeFlowNodeTypeCollection();
      stub = sinon.stub(sut, 'getFlowNodeTypeCollection');
      stub.returns(fakeFlowNodeTypeCollection);
    });

    it('should be a function', function () {
      var request = { user : {resource : {uuid : '1234'}}};
      sut.getFlowNodeTypes(request, fakeResponse);
    });

    it('should call getFlowNodeTypeCollection with user uuid', function () {
      var request = { user : {resource : {uuid : '1234'}}};
      sut.getFlowNodeTypes(request, fakeResponse);
      expect(sut.getFlowNodeTypeCollection).to.have.been.calledWith('1234');
    });

    it('should call fetch on the fakeFlowNodeTypeCollection', function () {
      var request = { user : {resource : {uuid : '1234'}}};
      sut.getFlowNodeTypes(request, fakeResponse);
      expect(fakeFlowNodeTypeCollection.fetch).to.have.been.called;
    });

    describe('when fetch resolves', function () {
      beforeEach(function () {
        var request = { user : {resource : {uuid : '1234'}}};
        sut.getFlowNodeTypes(request, fakeResponse);
        fakeFlowNodeTypeCollection.fetch.successCallback();
      });

      it('should call response.send', function () {
        expect(fakeResponse.send).to.have.been.called;
      });
    });
  });
});

var FakeFlowNodeTypeCollection = function(){
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

var FakeResponse = function(){
  this.send = sinon.spy();
  return this;
};
