describe('User', function () {
  var User, sut;

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
        var api;
        sut.overwriteOrAddApiByChannelId('asdf');
        api = sut.api[0];
        expect(api.channelid).to.equal('asdf');
      });

      it('should insert a record into api with a different channel id', function () {
        var api;
        sut.overwriteOrAddApiByChannelId('1234');
        api = sut.api[0];
        expect(api.channelid).to.equal('1234');
      });

      it('should add in the authtype attribute', function () {
        var api;
        sut.overwriteOrAddApiByChannelId('asdf', {authtype: 'oauth'});

        api = sut.api[0];
        expect(api.authtype).to.equal('oauth');
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
          var api = sut.api[0];
          expect(api.authtype).to.equal('simple');
        });
      });

      describe('when called with a different channelid', function () {
        beforeEach(function(){
          sut.overwriteOrAddApiByChannelId('1234', {authtype: 'complex'});
        });

        it('should insert a new record', function () {
          var api = sut.api[1];
          expect(api.authtype).to.equal('complex');
        });
      });
    });
  });
});


