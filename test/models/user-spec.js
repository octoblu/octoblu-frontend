describe('User', function () {
  var User, sut;
  var moment = require('moment');

  before(function () {
    var mongoose   = require('mongoose');
    var UserSchema = require('../../app/models/user');
    var db = mongoose.createConnection();
    User = db.model('User', UserSchema);
  });

  it('should instantiate', function () {
    expect(new User()).to.exist;
  });

  describe('overwriteOrAddApiByChannelId', function () {
    beforeEach(function () {
      sut = new User();
    });

    describe('when api is empty', function () {
      it('should return undefined', function () {
        expect(sut.overwriteOrAddApiByChannelId()).to.be.undefined;
      });

      it('should insert a record into api', function () {
        sut.overwriteOrAddApiByChannelId('asdf');
        expect(sut.api[0].channelid).to.equal('asdf');
      });

      it('should set the "updated" timestamp', function () {
        var updated, now;

        sut.overwriteOrAddApiByChannelId('asdf');

        updated = moment(sut.api[0].updated).valueOf();
        now     = moment().valueOf();
        expect(updated).to.be.closeTo(now, 1000);
      });

      it('should insert a record into api with a different channel id', function () {
        sut.overwriteOrAddApiByChannelId('1234');
        expect(sut.api[0].channelid).to.equal('1234');
      });

      it('should add in the authtype attribute', function () {
        sut.overwriteOrAddApiByChannelId('asdf', {authtype: 'oauth'});
        expect(sut.api[0].authtype).to.equal('oauth');
      });

      it('should add in the token attribute', function () {
        sut.overwriteOrAddApiByChannelId('asdf', {token: 'yutu'});
        expect(sut.api[0].token).to.equal('yutu');
      });
    });

    describe('when there is already an api', function () {
      beforeEach(function () {
        sut.api.push({channelid: 'asdf'});
      });

      describe('when called with the same channelid', function () {
        beforeEach(function(){
          sut.overwriteOrAddApiByChannelId('asdf', {authtype: 'simple'});
        });

        it('should update the existing api', function () {
          expect(sut.api[0].authtype).to.equal('simple');
        });
      });

      describe('when called with a different channelid', function () {
        beforeEach(function(){
          sut.overwriteOrAddApiByChannelId('1234', {authtype: 'complex'});
        });

        it('should insert a new record', function () {
          expect(sut.api[1].authtype).to.equal('complex');
        });
      });
    });
  });
});


