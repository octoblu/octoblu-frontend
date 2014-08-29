var when = require('when');
var NodeTypeController = require('../../app/controllers/node-type-controller');

describe('NodeTypeController', function () {
  var sut, nodeTypeCollection;

  beforeEach(function () {
    nodeTypeCollection = new NodeTypeCollection();
    sut = new NodeTypeController({NodeTypeCollection: nodeTypeCollection});
  });

  it('should instantiate', function () {
    expect(sut).to.exist;
  });

  describe('index', function () {
    var response;
    beforeEach(function () {
      response = new Response();
      sut.index({}, response);
    });

    it('should call NodeTypeCollection.fetch', function () {
      expect(nodeTypeCollection.fetch).to.have.been.called;
    });

    describe('when NodeTypeCollection.fetch resolves with emptiness', function () {
      beforeEach(function (done) {
        nodeTypeCollection.fetch.resolve([]);
        nodeTypeCollection.fetch.promise.finally(done);
      });

      it('should call response.send with an empty array', function () {
        expect(response.send).to.have.been.calledWith(200, []);
      });
    });

    describe('when NodeTypeCollection.fetch resolves with an item', function () {
      beforeEach(function (done) {
        nodeTypeCollection.fetch.resolve([{type: 'nodeType', uuid: '1'}]);
        nodeTypeCollection.fetch.promise.finally(done);
      });

      it('should call response.send with an single item array', function () {
        var firstCall, status, body;
        firstCall = response.send.firstCall;
        status    = firstCall.args[0];
        body      = firstCall.args[1];

        expect(status).to.equal(200);
        expect(body).to.have.a.lengthOf(1);
      });

      it('should add a resourceType to the item', function () {
        var firstCall, status, body;
        firstCall = response.send.firstCall;
        item      = _.first(firstCall.args[1]);

        expect(item).to.have.property('resourceType');
      });
    });

    describe('when NodeTypeCollection.fetch errors', function () {
      beforeEach(function (done) {
        nodeTypeCollection.fetch.reject({error: 'uh oh'});
        nodeTypeCollection.fetch.promise.finally(done);
      });

      it('should call response.send with a 500', function () {
        expect(response.send).to.have.been.calledWith(500, {error: 'uh oh'});
      });
    });
  });
});

var NodeTypeCollection = function(){
  var self = this;

  self.fetch = sinon.spy(function(){
    var deferred = when.defer();
    self.fetch.resolve = deferred.resolve;
    self.fetch.reject  = deferred.reject;
    self.fetch.promise = deferred.promise;
    return deferred.promise;
  });
}

var Response = function(){
  var self = this;

  self.send = sinon.spy();
}
