var FlowController = require('../../app/controllers/flow');
var _ = require('underscore');

describe('FlowController', function () {

  var sut, res;
  beforeEach(function () {
    sut = new FlowController({Flow: FakeFlow})
    res = new FakeResponse();
  });

  describe('updateOrCreate', function () {

    describe('when called with 123 and foo: bar', function () {
      beforeEach(function () {
        var req = {
          params: {
            id: 123
          },
          body: {
            foo: 'bar'
          },
          user: { skynet: {uuid: '233435'} }
        };
        sut.updateOrCreate(req, res);
      });

      it('should call updateOrCreateByFlowIdAndUser on Flow', function () {
        expect(FakeFlow.updateOrCreateByFlowIdAndUser.called).to.be.true;
      });

      it('should call updateOrCreateByFlowIdAndUser with the id and body', function () {
        expect(FakeFlow.updateOrCreateByFlowIdAndUser.calledWith).to.deep.equal(
          [123, '233435', {foo: 'bar'}]
        );
      });

      it('should not call response.send', function () {
        expect(res.send.called).not.to.be.true;
      });

      describe('when the Flow responds with a success', function () {
        beforeEach(function () {
          FakeFlow.updateOrCreateByFlowIdAndUser.success();
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
          FakeFlow.updateOrCreateByFlowIdAndUser.error();
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
          },
          user: { skynet: {uuid: 'abcde'} }
        };
        sut.updateOrCreate(req, res);
      });

      it('should call updateOrCreateByFlowIdAndUser with the id and body', function () {
        expect(FakeFlow.updateOrCreateByFlowIdAndUser.calledWith).to.deep.equal(
          [456, 'abcde', {foo: 'widget'}]
        );
      });
    });
  });

  describe('delete', function () {
    describe('when called with 123', function () {
      beforeEach(function () {
        var req = {
          params: {
            id: 123
          },
          user: { skynet: {uuid: '233435'} }
        };
        sut.delete(req, res);
      });

      it('should call deleteByFlowId on Flow', function () {
        expect(FakeFlow.deleteByFlowId.called).to.be.true;
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
          },
          user: { skynet: {uuid: 'abcde'} }
        };
        sut.updateOrCreate(req, res);
      });

      it('should call updateOrCreateByFlowIdAndUser with the id and body', function () {
        expect(FakeFlow.updateOrCreateByFlowIdAndUser.calledWith).to.deep.equal(
          [456, 'abcde', {foo: 'widget'}]
        );
      });
    });
  });

});

var FakeFlow = function(){ return this; };
FakeFlow.updateOrCreateByFlowIdAndUser = function(){
  FakeFlow.updateOrCreateByFlowIdAndUser.called = true;
  FakeFlow.updateOrCreateByFlowIdAndUser.calledWith = _.values(arguments);

  return {
    then: function(successCallback, errorCallback){
      FakeFlow.updateOrCreateByFlowIdAndUser.success = successCallback;
      FakeFlow.updateOrCreateByFlowIdAndUser.error   = errorCallback;
    }
  };

};

FakeFlow.deleteByFlowId = function() {
  FakeFlow.deleteByFlowId.called = true;
  FakeFlow.deleteByFlowId.calledWith = _.values(arguments);
  return {
    then: function (successCallback, errorCallback) {
      FakeFlow.deleteByFlowId.success = successCallback;
      FakeFlow.deleteByFlowId.error = errorCallback;
    }
  };
};

var FakeResponse = function(){
  var response = this;

  response.send = function(status){
    response.send.called = true;
    response.send.calledWith = status;
  };

  return response;
};
