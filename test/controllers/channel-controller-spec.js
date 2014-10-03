var when = require('when');
var ChannelController = require('../../app/controllers/channel-controller');

describe('ChannelController', function () {
  'use strict';

  var sut, channel, request, response, channelCollection;

  beforeEach(function () {
    channelCollection = new FakeChannelCollection();
    sut = new ChannelController();

    var stub = sinon.stub(sut, 'getChannelCollection');
    stub.returns(channelCollection);
  });

  it('should instantiate', function () {
    expect(sut).to.exist;
  });

  describe('get', function () {
    describe('when called with a id of 1', function () {
      beforeEach(function () {
        request = { user: { resource: { uuid: 'U1'} }, params : {id: '1'}};
        response = new Response();
        sut.get(request, response);
      });

      it('should call get on the channelCollection', function () {
        expect(channelCollection.get).to.have.been.calledWith('U1', '1');
      });

      describe('when channelCollection.get resolves', function () {
        beforeEach(function (done) {
          channel = {foo: 'bar'};
          channelCollection.get.resolve(channel);
          channelCollection.get.promise.finally(done);
        });

        it('should call response.send with the channel', function () {
          expect(response.send).to.have.been.calledWith(channel);
        });
      });

      describe('when channelCollection.get resolves with a different channel', function () {
        beforeEach(function (done) {
          channel = {bar: 'foo'};
          channelCollection.get.resolve(channel);
          channelCollection.get.promise.finally(done);
        });

        it('should call response.send with the channel', function () {
          expect(response.send).to.have.been.calledWith(channel);
        });
      });
    });

    describe('when called with a id of 2', function () {
      beforeEach(function () {
        request = { user: { resource: { uuid: 'U2'} }, params : {id: '2'}};
        response = new Response();
        sut.get(request, response);
      });

      it('should call get on the channelCollection', function () {
        expect(channelCollection.get).to.have.been.calledWith( 'U2', '2');
      });
    });
  });

  var Response = function(){
    var self = this;
    self.send = sinon.spy();
  };

  var FakeChannelCollection = function() {
    var self = this;
    self.get = sinon.spy(function(){
      var defer = when.defer();
      self.get.resolve = defer.resolve;
      self.get.promise = defer.promise;
      return defer.promise;
    });
  };
});
