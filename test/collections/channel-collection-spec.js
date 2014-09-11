var when              = require('when');
var ChannelCollection = require('../../app/collections/channel-collection');
var mongoose          = require('mongoose');

describe('ChannelCollection', function () {
  var sut, fetchApisByIds, getUser, result, db;

  beforeEach(function(){
    var mongoose   = require('mongoose');
    var ApiSchema  = require('../../app/models/api');
    var UserSchema = require('../../app/models/user');

    db = mongoose.createConnection();
    db.model('Api', ApiSchema);
    db.model('User', UserSchema);
  });

  beforeEach(function(){
    var getUserDefer, fetchApiByIdDefer, fetchApisByIdsDefer;

    sut     = new ChannelCollection({mongoose: db});

    fetchApiByIdDefer = when.defer();
    sinon.stub(sut, 'fetchApiById').returns(fetchApiByIdDefer.promise);
    sut.fetchApiById.reject  = fetchApiByIdDefer.reject;
    sut.fetchApiById.resolve = fetchApiByIdDefer.resolve;

    fetchApisByIdsDefer = when.defer();
    fetchApisByIds = sinon.stub(sut, 'fetchApisByIds');
    fetchApisByIds.returns(fetchApisByIdsDefer.promise);
    fetchApisByIds.resolve = fetchApisByIdsDefer.resolve;

    getUserDefer = when.defer();
    getUser = sinon.stub(sut, 'getUser');
    getUser.returns(getUserDefer.promise);
    getUser.resolve = getUserDefer.resolve;
  });

  describe('get', function () {
    describe('when called with a uuid and channel id', function () {
      var promise;

      beforeEach(function () {
        promise = sut.get('uselessUUID', '123');
      });

      describe('when getUser and fetchApiById resolve/reject with no apis', function () {
        beforeEach(function () {
          fakeUser = {api: []};
          getUser.resolve(fakeUser);
          sut.fetchApiById.reject();
        });

        it('should reject its promise', function (done) {
          promise.catch(function(){
            done();
          });
        });
      });

      describe('when getUser and fetchApiById resolves with 1 api', function () {
        beforeEach(function () {
          fakeUser = {api: [{_id : '1234567', channelid : '980123'}]};
          getUser.resolve(fakeUser);
          sut.fetchApiById.resolve({_id: '980123', name: 'FooNetwork'});
        });

        it('should resolve its promise with the mashup of the channel and channelActivation', function (done) {
          promise.then(function(channel){
            expect(channel.name).to.equal('FooNetwork');
            expect(channel.channelid).to.equal('980123');
            expect(channel.channelActivationId).to.equal('1234567');
            done();
          }).catch(done);
        });
      });

      describe('when getUser and fetchApiById resolves with more than one api', function () {
        beforeEach(function () {
          fakeUser = {api: [{_id : '7654321', channelid : '321089'}]};
          getUser.resolve(fakeUser);
          sut.fetchApiById.resolve({_id: '321089', name: 'BarNetwork'});
        });

        it('should resolve its promise with the mashup of the channel and channelActivation', function (done) {
          promise.then(function(channel){
            expect(channel.name).to.equal('BarNetwork');
            expect(channel.channelid).to.equal('7654321');
            expect(channel.channelActivationId).to.equal('321089');
            done();
          }).catch(done);
        });
      });
    });
  });

  describe('fetch', function () {

    beforeEach(function () {
      result = sut.fetch('uselessUUID');
    });

    it('should getUser', function () {
      expect(getUser).to.have.been.called;
    });

    describe('when the user returns no api(s)', function(){
      var fakeUser;
      beforeEach(function () {
        fakeUser = {api: []};
        getUser.resolve(fakeUser);
      });

      describe('when fetchByChannelIds resolves with no channel', function () {
        beforeEach(function(){
          fetchApisByIds.resolve([]);
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
        getUser.resolve(fakeUser);
      });

      describe('when fetchByChannelIds resolves with a channel', function () {
        beforeEach(function(){
          fetchApisByIds.resolve([{_id: '123', name: 'FooNetwork'}]);
        });

        it('should have called fetchByChannelIds on channel', function (done) {
          result.then(function(apis){
            expect(fetchApisByIds).to.have.been.calledWith(['123']);
            done();
          }).catch(done);
        });

        it('should merge the channel in with the user api', function (done) {
          result.then(function(apis){
            var api = _.first(apis);
            expect(apis).to.have.a.lengthOf(1);
            expect(api.channelid).to.equal('123');
            expect(api.channelActivationId).to.equal('321');
            expect(api.name).to.equal('FooNetwork');
            done();
          }).catch(done);
        });
      });
    });

    describe('when the user returns an api(s)', function(){
      var fakeUser;
      beforeEach(function () {
        fakeUser = {api: [{_id: '999', channelid: '888', whatever: 'something'}]};
        getUser.resolve(fakeUser);
      });

      describe('when fetchByChannelIds resolves with a channel', function () {
        beforeEach(function(){
          var channel = {_id: '888', name: 'TheOcho', params: {}};
          fetchApisByIds.resolve([channel]);
        });

        it('should have called fetchByChannelIds on channel', function (done) {
          result.then(function(apis){
            expect(fetchApisByIds).to.have.been.calledWith(['888']);
            done();
          }).catch(done);
        });

        it('should merge the channel in with the user api', function (done) {
          result.then(function(apis){
            var api = _.first(apis);
            expect(apis).to.have.a.lengthOf(1);
            expect(api.channelid).to.equal('888');
            expect(api.channelActivationId).to.equal('999');
            expect(api.name).to.equal('TheOcho');
            done();
          }).catch(done);
        });
      });
    });
  });
});
