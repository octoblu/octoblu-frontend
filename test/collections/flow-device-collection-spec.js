var when = require('when');
var octobluDB = require('../../app/lib/database');
var FlowDeviceCollection = require('../../app/collections/flow-device-collection');

describe('FlowDeviceCollection', function () {
  var sut, result, getDevicesByOwner, users;

  beforeEach(function () {
    octobluDB.createConnection();
    users = {
      'u1': {
        'skynet.uuid': 'u1',
      },
      'u2': {
        'skynet.uuid': 'u2',
      }
    };

    sut = new FlowDeviceCollection('u1', 't2');
  });

  describe('fetch', function () {
    describe('when getDevicesByOwner returns an empty array', function () {
      beforeEach(function () {
        var defer = when.defer();
        getDevicesByOwner = sinon.stub(sut, 'getDevicesByOwner');
        getDevicesByOwner.returns(defer.promise);
        defer.resolve([]);
      });

      it('should return an array', function (done) {
        sut.fetch().then(function (devices) {
          expect(devices).to.be.instanceof(Array);
          done();
        })
        .catch(done);
      });

      it('should return a list of devices that the user owns', function (done) {
        sut.fetch().then(function (results) {
          expect(getDevicesByOwner).to.have.been.calledWith();
          done();
        })
        .catch(done);
      });
    });

    describe('when getDevicesByOwner returns a non octoblu flow', function () {
      beforeEach(function () {
        var defer = when.defer();
        getDevicesByOwner = sinon.stub(sut, 'getDevicesByOwner');
        getDevicesByOwner.returns(defer.promise);
        defer.resolve([{type: 'device'}]);
      });

      it('should filter them out of the response', function (done) {
        result = sut.fetch();
        result.then(function(devices){
          expect(devices).to.have.be.empty;
          done();
        }).catch(done);
      });
    });
  });
});
