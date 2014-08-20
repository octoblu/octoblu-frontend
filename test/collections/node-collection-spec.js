var when = require('when');
var NodeCollection = require('../../app/collections/node-collection');

describe('NodeCollection', function () {
  var sut,
    channelStub,
    deviceStub,
    fakeChannelCollection,
    result,
    fakeDeviceCollection;

  beforeEach(function () {
    var userUUID = 'u1';
    sut = new NodeCollection(userUUID);

    fakeChannelCollection = new FakeChannelCollection();
    channelStub = sinon.stub(sut, 'getChannelCollection');
    channelStub.returns(fakeChannelCollection);

    fakeDeviceCollection = new FakeDeviceCollection();
    deviceStub = sinon.stub(sut, 'getDeviceCollection');
    deviceStub.returns(fakeDeviceCollection);
  });

  describe('#fetch', function () {
    beforeEach(function(){
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

    it('should call DeviceCollection', function () {
      expect(sut.getDeviceCollection).to.have.been.called;
    });

    it('should call fetch on DeviceCollection', function () {
      expect(fakeDeviceCollection.fetch).to.have.been.called;
    });

    describe('when DeviceCollection and ChannelCollection has nodes', function () {
      var channels, devices;
      beforeEach(function () {
        channels = [
          { name: 'BBC One', type: 'channel' },
          { name: 'C2', type: 'channel'}];
        devices = [
          { name: 'NetDuino 1', type: 'device' },
          { name: 'Buffy the Vampire Slayer', type: 'device'}
        ];

        fakeChannelCollection.fetch.successCallback(channels);
        fakeDeviceCollection.fetch.successCallback(devices);
      });

      it('should fulfill an an empty promise', function (done) {
        result.then(function (nodes) {
          expect(nodes).to.deep.equal(_.union(devices, channels));
          done();
        }).catch(done);
      });
    });
  });


  describe('#getChannels', function () {
    beforeEach(function () {
      result = sut.getChannels();
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

      it('should fulfill a promise with 2 items', function (done) {
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

  describe('#getDevices', function () {
    beforeEach(function(){
      result = sut.getDevices();
    });

    describe('when DeviceCollection responds with no devices', function () {
      beforeEach(function () {
        fakeDeviceCollection.fetch.successCallback([]);
      });

      it('should fulfill an an empty promise', function (done) {
        result.then(function (nodes) {
          expect(nodes).to.deep.equal([]);
          done();
        }).catch(done);
      });
    });

    describe('when DeviceCollection responds with an (N) devices', function () {
      beforeEach(function () {
        fakeDeviceCollection.fetch.successCallback([
          {},
          {}
        ]);
      });

      it('should fulfill a promise with 2 items', function (done) {
        result.then(function (nodes) {
          expect(nodes).to.deep.equal([
            {type: 'device'},
            {type: 'device'}
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
