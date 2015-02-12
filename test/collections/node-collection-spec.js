var when = require('when');
var NodeCollection = require('../../app/collections/node-collection');

describe('NodeCollection', function () {
  var sut,
    channelStub,
    deviceStub,
    nodeTypeCollectionStub,
    fakeChannelCollection,
    result,
    fakeDeviceCollection,
    fakeNodeTypeCollection,
    fakeFlowCollection;

  beforeEach(function () {
    var userUUID = 'u1';
    sut = new NodeCollection(userUUID);

    fakeChannelCollection = new FakeCollection();
    channelStub = sinon.stub(sut, 'getChannelCollection');
    channelStub.returns(fakeChannelCollection);

    fakeDeviceCollection = new FakeCollection();
    deviceStub = sinon.stub(sut, 'getDeviceCollection');
    deviceStub.returns(fakeDeviceCollection);

    fakeNodeTypeCollection = new FakeCollection();
    nodeTypeCollectionStub = sinon.stub(sut, 'getNodeTypeCollection');
    nodeTypeCollectionStub.returns(fakeNodeTypeCollection);

    fakeFlowCollection = new FakeCollection();
    flowCollectionStub = sinon.stub(sut, 'getFlowCollection');
    flowCollectionStub.returns(fakeFlowCollection);

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

    it('should call fetch on FlowCollection', function () {
      expect(fakeFlowCollection.fetch).to.have.been.called;
    });

    describe('when DeviceCollection and ChannelCollection has nodes', function () {
      var channels, devices;
      beforeEach(function () {
        channels = [
          { name: 'BBC One', category: 'channel', type: 'channel:bbc'},
          { name: 'C2', category: 'channel', type: 'channel:c2'}];
        devices = [
          { name: 'NetDuino 1', category: 'device', type: 'netduino' },
          { name: 'Buffy the Vampire Slayer', category: 'device', type: 'buffy'}
        ];

        fakeChannelCollection.fetch.successCallback(channels);
        fakeDeviceCollection.fetch.successCallback(devices);
      });

      describe('when nodetypes come back', function () {
        beforeEach(function () {
          var flows = [
            {skynet: {type: 'channel:bbc'}, logo: 'bbc.ping'},
            {skynet: {type: 'channel:c2'}, logo: 'c2.pee-een-ghee'},
            {skynet: {type: 'netduino'}, logo: 'netduino.jif'},
            {skynet: {type: 'buffy'}, logo: 'buffy.tiffany'},
          ];
          fakeNodeTypeCollection.fetch.successCallback(nodeTypes);
        });
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
            {category: 'channel', online: true, useStaticMessage: true},
            {category: 'channel', online: true, useStaticMessage: true}
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
            {category: 'device', staticMessage: {}, useStaticMessage: true},
            {category: 'device', staticMessage: {}, useStaticMessage: true}
          ]);
          done();
        }).catch(done);
      });
    });
  });
});

var FakeCollection = function () {
  var self = this;

  self.fetch = sinon.spy(function () {
    var defer = when.defer();
    self.fetch.successCallback = defer.resolve;
    return defer.promise;
  });

  return self;
};
