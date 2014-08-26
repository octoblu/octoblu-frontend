var NodeController = require('../../app/controllers/node-controller');
var when = require('when');

describe('NodeController', function () {
  var sut, fakeNode, fakeNodeCollection;

  beforeEach(function () {
    sut = new NodeController({Node: fakeNode});
    stub = sinon.stub(sut, 'getNodeCollection');
    fakeNodeCollection = new FakeNodeCollection;
    stub.returns(fakeNodeCollection);
  });

  it('should instantiate', function () {
    expect(sut).to.exist;
  });

  describe('index', function(){
    var fakeResponse;

    beforeEach(function () {
      fakeResponse = new FakeResponse();
      var user = {skynet: {uuid: 'mah uuid'}};
      sut.index({user: user}, fakeResponse);
    });

    describe('when all returns', function(){
      beforeEach(function () {
        fakeNodeCollection.fetch.successCallback([{}, {}]);
      });

      it('should return 200 and an O.w.L.', function(){
        expect(fakeResponse.send).to.have.been.calledWith(200, [{},{}]);
      });
    });

    describe('when all returns a the one owl to rule them all', function(){
      beforeEach(function () {
        fakeNodeCollection.fetch.successCallback([{}]);
      });

      it('should return 200 and sauron', function(){
        expect(fakeResponse.send).to.have.been.calledWith(200, [{}]);
      });
    });

  });
});

var FakeNodeCollection = function(){
  var self = this;
  self.fetch = sinon.spy(function(){
    return {
      then: function(successCallback){
        self.fetch.successCallback = successCallback;
      }
    };
  });
  return self;
};

var FakeResponse = function(){
  var self = this;

  self.send = sinon.spy();

  return self;
};
