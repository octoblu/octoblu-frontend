var when              = require('when');
var ChannelCollection = require('../../app/collections/channel-collection');
var mongoose          = require('mongoose');

describe('ChannelCollection', function () {
  var sut, getUser, fetchByIds, defer, channelDefer, result, db;

  beforeEach(function(){
    var mongoose   = require('mongoose');
    var ApiSchema  = require('../../app/models/api');
    var UserSchema = require('../../app/models/user');

    db = mongoose.createConnection();
    db.model('Api', ApiSchema);
    db.model('User', UserSchema);
  });

  beforeEach(function(){
    sut     = new ChannelCollection('uselessUUID', {mongoose: db});
    defer = when.defer();
    getUser = sinon.stub(sut, 'getUser');
    getUser.returns(defer.promise);
    fetchByIds = sinon.stub(sut, 'fetchByIds');
    channelDefer = when.defer();
    fetchByIds.returns(channelDefer.promise);
  });

  describe('fetch', function () {
    beforeEach(function () {
      result = sut.fetch();
    });

    it('should getUser', function () {
      expect(getUser).to.have.been.called;
    });

    describe('when the user returns no api(s)', function(){
      var fakeUser;
      beforeEach(function () {
        fakeUser = {api: []};
        defer.resolve(fakeUser);
      });

      describe('when fetchByChannelIds resolves with no channel', function () {
        beforeEach(function(){
          channelDefer.resolve([]);
        });

        it('should be empty', function(done){
          result.then(function(apis){
            expect(apis).to.deep.equal([]);
            done();
          }).catch(done);
        });
      });
    });

    describe('when the user returns an api(s)', function(){
      var fakeUser;
      beforeEach(function () {
        fakeUser = {api: [{_id: '321', channelid: '123', whatever: 'somethingelse', whoosawhatsit: 'floosenhousen'}]};
        defer.resolve(fakeUser);
      });

      describe('when fetchByChannelIds resolves with a channel', function () {
        beforeEach(function(){
          channelDefer.resolve([{_id: '123', name: 'FooNetwork'}]);
        });

        it('should have called fetchByChannelIds on channel', function (done) {
          result.then(function(apis){
            expect(fetchByIds).to.have.been.calledWith(['123']);
            done();
          }).catch(done);
        });

        it('should merge the channel in with the user api', function (done) {
          result.then(function(apis){
            var expected = JSON.stringify([{channelid: '123', channelActivationId: '321', name: 'FooNetwork'}]);
            expect(JSON.stringify(apis)).to.deep.equal(expected);
            done();
          }).catch(done);
        });
      });
    });

    describe('when the user returns an api(s)', function(){
      var fakeUser;
      beforeEach(function () {
        fakeUser = {api: [{_id: '999', channelid: '888', whatever: 'something'}]};
        defer.resolve(fakeUser);
      });

      describe('when fetchByChannelIds resolves with a channel', function () {
        beforeEach(function(){
          channelDefer.resolve([{_id: '888', name: 'TheOcho', params: {}}]);
        });

        it('should have called fetchByChannelIds on channel', function (done) {
          result.then(function(apis){
            expect(fetchByIds).to.have.been.calledWith(['888']);
            done();
          }).catch(done);
        });

        it('should merge the channel in with the user api', function (done) {
          result.then(function(apis){
            var expected = JSON.stringify([{channelid: '888', channelActivationId: '999', name: 'TheOcho'}]);
            expect(JSON.stringify(apis)).to.deep.equal(expected);
            done();
          }).catch(done);
        });
      });
    });
  });
});
