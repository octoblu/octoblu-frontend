var when = require('when');
var NodeCollection = require('../../app/collections/node-collection');

describe('NodeCollection', function () {
  var sut, fakeChannelCollection, fakeDeviceCollection, channelStub, deviceStub;

  beforeEach(function () {
    var userUUID = 'lskdfj';
    sut = new NodeCollection(userUUID);

    fakeChannelCollection = new FakeChannelCollection();
    channelStub = sinon.stub(sut, 'getChannelCollection');
    channelStub.returns(fakeChannelCollection);

    fakeDeviceCollection = new FakeDeviceCollection();
    deviceStub = sinon.stub(sut, 'getDeviceCollection');
    deviceStub.returns(fakeDeviceCollection);
  });

  describe('#fetch', function () {
    var result;
    beforeEach(function () {
      result = sut.fetch();
    });

    it('should return a promise', function () {
      expect(result.then).to.exist;
    });

    it('should call ChannelCollection', function () {
      expect(sut.getChannelCollection).to.have.been.called;
    });

    it('should call fetch on ChannelCollection', function () {
      expect(fakeChannelCollection.fetch).to.have.been.called;
    });

    describe('when ChannelCollection responds with no channels', function () {
      beforeEach(function () {
        fakeChannelCollection.fetch.successCallback([]);
      });

      it('should fulfill an an empty promise', function (done) {
        result.then(function (nodes) {
          expect(nodes).to.deep.equal([]);
          done();
        }).catch(done);
      });
    });

    describe('when ChannelCollection responds with an (N) channels', function () {
      beforeEach(function () {
        fakeChannelCollection.fetch.successCallback([
          {},
          {}
        ]);
      });

      it('should fulfill an an empty promise', function (done) {
        result.then(function (nodes) {
          expect(nodes).to.deep.equal([
            {type: 'channel'},
            {type: 'channel'}
          ]);
          done();
        }).catch(done);
      });
    });
  });
});

var FakeChannelCollection = function () {
  var self = this;

  self.fetch = sinon.spy(function () {
    var defer = when.defer();
    self.fetch.successCallback = defer.resolve;
    return defer.promise;
  });

  return self;
};

var FakeDeviceCollection = function () {
  var self = this;

  self.fetch = sinon.spy(function () {
    var defer = when.defer();
    self.fetch.successCallback = defer.resolve;
    return defer.promise;
  });

  return self;
};
