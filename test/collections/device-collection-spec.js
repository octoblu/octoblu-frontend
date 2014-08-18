var when = require('when');
var DeviceCollection = require('../../app/collections/device-collection');

describe('DeviceCollection', function () {
  var sut, result, getUser, getDevicesByOwner, users;

  beforeEach(function () {
    users = {
      '1' : {
        uuid: '1'
      },
      '2' : {
        uuid: '2'
      }
    };
    sut = new DeviceCollection('uselessUUID');

    getUser = sinon.stub(sut, 'getUser', function (userId) {
      return when.resolve(users[userId]);
    });

    getDevicesByOwner = sinon.stub(sut, 'getDevicesByOwner')
      .returns([]);
  });

  describe('fetch', function () {
    beforeEach(function () {

    });

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

    xit('should return a list of devices that the user owns', function (done) {
      when.all([sut.fetch('1'), sut.fetch('2')])
        .then(function (results) {
          expect(getDevicesByOwner).to.have.been.called.with(users['1']);
          expect(getDevicesByOwner).to.have.been.called.with(users['2']);
          done();
        })
        .catch(done);
    });
  });

});
