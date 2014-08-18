var FlowNodeTypeCollection = require('../../app/collections/flow-node-type-collection');
var when = require('when');

describe('FlowNodeTypeCollection', function () {
  var sut, stub, fakeFS, fakeNodeCollection;

  beforeEach(function () {
    fakeFS = new FakeFS();
    sut = new FlowNodeTypeCollection('user uuid', {fs: fakeFS});

    fakeNodeCollection = new FakeNodeCollection();
    stub = sinon.stub(sut, 'getNodeCollection');
    stub.returns(fakeNodeCollection);
  });

  describe('fetch', function () {
    var promise;

    beforeEach(function () {
      sinon.spy(sut, 'fromFile');
      promise = sut.fetch();
    });

    it('should call fromFile', function () {
      expect(sut.fromFile).to.have.been.called;
    });

    it('should call getNodeCollection with the user uuid', function () {
      expect(stub).to.have.been.called;
    });

    it('should call nodeCollection.fetch', function(){
      expect(fakeNodeCollection.fetch).to.have.been.called;
    });

    describe('when fakeNodeCollection.fetch and fromFile resolve', function () {
      it('should merge the results', function (done) {
        var flowNodeType1, flowNodeType2;
        flowNodeType1 = {name : 'flowNodeType1'};
        flowNodeType2 = {name : 'flowNodeType2'};

        fakeFS.readFile.resolve(null, JSON.stringify([flowNodeType1]));
        fakeNodeCollection.fetch.resolve([flowNodeType2]);

        promise.then(function(flowNodeTypes){
          expect(flowNodeTypes).to.contain.members(flowNodeType1, flowNodeType2);
        }).finally(done);
      });
    });
  });

  describe('fromFile', function () {
    it('should call readFile with the filename', function () {
      sut.fromFile();
      expect(fakeFS.readFile).to.have.been.calledWith('assets/json/flow-node-types.json');
    });

    it('should return the nodetypes in a promise', function (done) {
      sut.fromFile()
      .then(function(nodeTypes) {
        expect(_.size(nodeTypes)).to.equal(2);
        done();
      });

      _.defer(function(){
        fakeFS.readFile.resolve(null, JSON.stringify([{}, {}]));
      });
    });
  });

  describe('fromNodes', function () {
    it('should call getNodeCollection', function () {
      sut.fromNodes();
      expect(stub).to.have.been.called;
    });

    it('should call fetch on the nodeCollection', function () {
      sut.fromNodes();
      expect(fakeNodeCollection.fetch).to.have.been.called;
    });

    describe('when getNodeCollection resolves', function () {
      it('should map the response to node types', function (done) {
        var node1 = {name : 'node1'};
        var nodes = [node1];

        sut.fromNodes().then(function(responseNodes){
          expect(nodes).to.deep.equal(responseNodes);
        }).finally(done);

        fakeNodeCollection.fetch.resolve(nodes);
      });
    });
  });
});

var FakeFS = function(){
  var self = this;

  self.readFile = sinon.spy(function(filename, options, callback){
    self.readFile.resolve = callback;
  });

  return self;
};

var FakeNodeCollection = function(){
  var self = this;

  self.fetch = sinon.spy(function(){
    var defer = when.defer();
    self.fetch.resolve = defer.resolve;
    return defer.promise;
  });

  return self;
};
