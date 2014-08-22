var when = require('when');
var DeviceCollection = require('../../app/collections/device-collection');

describe('DeviceCollection', function () {
  var sut, result, getUser, getDevicesByOwner, users;

  beforeEach(function () {
    users = {
      'u1': {
        skynetuuid: 'u1',
        skynettoken: 't1'
      },
      'u2': {
        skynetuuid: 'u2',
        skynettoken: 't2'
      }
    };

    sut = new DeviceCollection('u1');

    getUser = sinon.stub(sut, 'getUser', function (userId) {
      return when.resolve(users[userId]);
    });

    getDevicesByOwner = sinon.stub(sut, 'getDevicesByOwner')
      .returns([]);
  });

  describe('fetch', function () {
    it('should call getUser', function () {
      result = sut.fetch();
      expect(getUser).to.have.been.called;
    });

    it('should return an array', function (done) {
      sut.fetch()
        .then(function (devices) {
          expect(devices).to.be.instanceof(Array);
          done();
        })
        .catch(done);
    });

    it('should return a list of devices that the user owns', function (done) {
      sut.fetch()
        .then(function (results) {
          expect(getDevicesByOwner).to.have.been.calledWith(users['u1']);
          done();
        })
        .catch(done);
    });

  });

});
