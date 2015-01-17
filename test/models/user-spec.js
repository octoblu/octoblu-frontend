var octobluDB = require('../../app/lib/database');

describe('User', function () {
  var User, sut;

  var twitterChannelType = 'channel:twitter';
  var twitterChannelId  = '5409f79403f1d8b163401370';

  var googlePlusChannelType = 'channel:google-plus';
  var googlePlusChannelId  = '543bf27e652c4207680866f8';

  var moment = require('moment');

  beforeEach(function () {
    octobluDB.createConnection();
    User = require('../../app/models/user');
  });

  describe('resetPasswordToken', function(){
    beforeEach(function(){
      return User.createUser({email:'foo@bar.com', password: 'abc123'}).then(function(user){
        return User.setResetPasswordToken(user);
      });
    });

    it('should set the resetPasswordToken', function(){
      return User.findByEmail('foo@bar.com').then(function(user){
        console.log(user);
        expect(user.resetPasswordToken).to.exist;
      });
    });
  });

  describe('overwriteOrAddApiByChannelType', function () {
    beforeEach(function () {
      sut = {};
    });

    describe('when api is empty', function () {
      it('should return undefined', function () {
        expect(User.overwriteOrAddApiByChannelType(sut, twitterChannelType)).to.be.undefined;
      });

      it('should insert a record into api with type', function () {
        User.overwriteOrAddApiByChannelType(sut, twitterChannelType);
        expect(sut.api[0].type).to.equal(twitterChannelType);
      });

      it('should set the "updated" timestamp', function () {
        var updated, now;

        User.overwriteOrAddApiByChannelType(sut, twitterChannelType);

        updated = moment(sut.api[0].updated).valueOf();
        now     = moment().valueOf();
        expect(updated).to.be.closeTo(now, 1000);
      });

      it('should insert a record into api with a different channel id', function () {
        User.overwriteOrAddApiByChannelType(sut, googlePlusChannelType);
        expect(sut.api[0].type).to.equal(googlePlusChannelType);
      });

      it('should add in the authtype attribute', function () {
        User.overwriteOrAddApiByChannelType(sut, twitterChannelType, {authtype: 'oauth'});
        expect(sut.api[0].authtype).to.equal('oauth');
      });

      it('should add in the token attribute', function () {
        User.overwriteOrAddApiByChannelType(sut, twitterChannelType, {token: 'yutu'});
        expect(sut.api[0].token).to.equal('yutu');
      });
    });

    describe('when there is already an api', function () {
      beforeEach(function () {
        sut.api = [{type: twitterChannelType}];
      });

      describe('when called with the same type', function () {
        beforeEach(function(){
          User.overwriteOrAddApiByChannelType(sut, twitterChannelType, {authtype: 'simple'});
        });

        it('should update the existing api', function () {
          expect(sut.api[0].authtype).to.equal('simple');
        });
      });

      describe('when called with a different type', function () {
        beforeEach(function(){
          User.overwriteOrAddApiByChannelType(sut, googlePlusChannelType, {authtype: 'complex'});
        });

        it('should insert a new record', function () {
          expect(sut.api[1].authtype).to.equal('complex');
        });
      });
    });
  });

  describe('overwriteOrAddApiByChannelId', function () {
    beforeEach(function () {
      sut = {

      };
    });

    describe('when api is empty', function () {
      var channelId = '12345';
      beforeEach(function(){

      });

      it('should return undefined', function () {
        expect(User.overwriteOrAddApiByChannelId(sut, twitterChannelId)).to.be.undefined;
      });

      it('should insert a record into api with channelid', function () {
        User.overwriteOrAddApiByChannelId(sut, twitterChannelId);
        expect(sut.api[0].channelid.toString()).to.equal(twitterChannelId);
      });

      it('should set the "updated" timestamp', function () {
        var updated, now;

        User.overwriteOrAddApiByChannelId(sut, twitterChannelId);

        updated = moment(sut.api[0].updated).valueOf();
        now     = moment().valueOf();
        expect(updated).to.be.closeTo(now, 1000);
      });

      it('should insert a record into api with a different channel id', function () {
        User.overwriteOrAddApiByChannelId(sut, googlePlusChannelId);
        expect(sut.api[0].channelid.toString()).to.equal(googlePlusChannelId);
      });

      it('should add in the authtype attribute', function () {
        User.overwriteOrAddApiByChannelId(sut, twitterChannelId, {authtype: 'oauth'});
        expect(sut.api[0].authtype).to.equal('oauth');
      });

      it('should add in the token attribute', function () {
        User.overwriteOrAddApiByChannelId(sut, twitterChannelId, {token: 'yutu'});
        expect(sut.api[0].token).to.equal('yutu');
      });
    });

    describe('when there is already an api', function () {
      beforeEach(function () {
        sut.api = [{type : twitterChannelType, channelid: twitterChannelId }];
      });

      describe('when called with the same channelid', function () {
        beforeEach(function(){
          User.overwriteOrAddApiByChannelId(sut, twitterChannelId, {authtype: 'simple'});
        });

        it('should update the existing api', function () {
          expect(sut.api[0].authtype).to.equal('simple');
        });
      });

      describe('when called with a different channelid', function () {
        beforeEach(function(){
          User.overwriteOrAddApiByChannelId(sut, googlePlusChannelId, {authtype: 'complex'});
        });

        it('should insert a new record', function () {
          expect(sut.api[1].authtype).to.equal('complex');
        });
      });
    });
  });
});


