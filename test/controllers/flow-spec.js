var FlowController = require('../../app/controllers/flow');
var _ = require('underscore');

describe('FlowController', function () {
  describe('findOrCreate', function () {
    var sut, res;

    beforeEach(function () {
      sut = new FlowController({Flow: FakeFlow})
      res = new FakeResponse();
    });

    describe('when called with 123 and foo: bar', function () {
      beforeEach(function () {
        var req = {
          params: {
            id: 123
          },
          body: {
            foo: 'bar'
          }
        };
        sut.findOrCreate(req, res);
      });

      it('should call findOrCreateById on Flow', function () {
        expect(FakeFlow.findOrCreateById.called).to.be.true;
      });

      it('should call findOrCreateById with the id and body', function () {
        expect(FakeFlow.findOrCreateById.calledWith).to.deep.equal(
          [123, {foo: 'bar'}]
        );
      });

      it('should not call response.send', function () {
        expect(res.send.called).not.to.be.true;
      });

      describe('when the Flow responds with a success', function () {
        beforeEach(function () {
          FakeFlow.findOrCreateById.success();
        });

        it('should respond', function () {
          expect(res.send.called).to.be.true;
        });

        it('respond with a 204', function () {
          expect(res.send.calledWith).to.equal(204);
        });
      });

      describe('when the Flow responds with a error', function () {
        beforeEach(function () {
          FakeFlow.findOrCreateById.error();
        });

        it('respond with a 422', function () {
          expect(res.send.calledWith).to.equal(422);
        });
      });
    });

    describe('when called with 456 and foo: widget', function () {
      beforeEach(function () {
        var req = {
          params: {
            id: 456
          },
          body: {
            foo: 'widget'
          }
        };
        sut.findOrCreate(req, res);
      });

      it('should call findOrCreateById with the id and body', function () {
        expect(FakeFlow.findOrCreateById.calledWith).to.deep.equal(
          [456, {foo: 'widget'}]
        );
      });
    });
  });
});

var FakeFlow = function(){ return this; };
FakeFlow.findOrCreateById = function(){
  FakeFlow.findOrCreateById.called = true;
  FakeFlow.findOrCreateById.calledWith = _.values(arguments);

  return {
    then: function(successCallback, errorCallback){
      FakeFlow.findOrCreateById.success = successCallback;
      FakeFlow.findOrCreateById.error   = errorCallback;
    }
  };
};

var FakeResponse = function(){
  var response = this;

  response.send = function(status){
    response.send.called = true;
    response.send.calledWith = status;
  }

  return response;
};
