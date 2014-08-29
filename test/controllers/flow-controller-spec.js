var FlowController = require('../../app/controllers/flow-controller');
var _ = require('lodash');

describe('FlowController', function () {
  var sut, res, flow, fakeFlow;

  beforeEach(function () {
    fakeFlow = new FakeFlow();
    sut = new FlowController({Flow: fakeFlow});
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
          user: { resource: {uuid: '233435'} }
        };
        sut.updateOrCreate(req, res);
      });

      it('should call updateOrCreateByFlowIdAndUser on Flow', function () {
        expect(fakeFlow.updateOrCreateByFlowIdAndUser).to.have.been.called;
      });

      it('should call updateOrCreateByFlowIdAndUser with the id and body', function () {
        expect(fakeFlow.updateOrCreateByFlowIdAndUser).to.have.been.calledWith(123, '233435', {foo: 'bar'});
      });

      it('should not call response.send', function () {
        expect(res.send.called).not.to.be.true;
      });

      describe('when the Flow responds with a success', function () {
        beforeEach(function () {
          fakeFlow.updateOrCreateByFlowIdAndUser.successCallback();
        });

        it('should respond with a 204', function () {
          expect(res.send).to.have.been.calledWith(204);
        });
      });

      describe('when the Flow responds with a error', function () {
        beforeEach(function () {
          fakeFlow.updateOrCreateByFlowIdAndUser.errorCallback();
        });

        it('respond with a 422', function () {
          expect(res.send).to.have.been.calledWith(422);
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
          user: { resource: {uuid: 'abcde'} }
        };
        sut.updateOrCreate(req, res);
      });

      it('should call updateOrCreateByFlowIdAndUser with the id and body', function () {
        expect(fakeFlow.updateOrCreateByFlowIdAndUser).to.have.been.calledWith(456, 'abcde', {foo: 'widget'});
      });
    });
  });

  describe('delete', function () {
    beforeEach(function () {
      var req = {
        params: {id: '5'},
        user:   { resource: {uuid: '1'} }
      };
      sut.delete(req, res);
    });

    it('should call deleteByFlowIdAndUserUUID on Flow', function () {
      expect(fakeFlow.deleteByFlowIdAndUserUUID).to.be.have.been.calledWith('5', '1');
    });

    describe('when fake flow calls the success callback', function () {
      beforeEach(function(){
        fakeFlow.deleteByFlowIdAndUserUUID.successCallback('some error');
      });

      it('should response with a 204 and no content', function () {
        expect(res.send).to.have.been.calledWith(204);
      });
    });

    describe('when fake flow calls the error callback', function () {
      beforeEach(function(){
        fakeFlow.deleteByFlowIdAndUserUUID.errorCallback('some error');
      });

      it('should response with a 500 and the error', function () {
        expect(res.send).to.have.been.calledWith(500, 'some error');
      });
    });
  });

  var FakeFlow = function () {
    var _this = this;

    _this.updateOrCreateByFlowIdAndUser = sinon.spy(function () {
      return {
        then: function (successCallback, errorCallback) {
          _this.updateOrCreateByFlowIdAndUser.successCallback = successCallback;
          _this.updateOrCreateByFlowIdAndUser.errorCallback   = errorCallback;
        }
      };
    });

    _this.deleteByFlowIdAndUserUUID = sinon.spy(function () {
      return {
        then: function (successCallback, errorCallback) {
          _this.deleteByFlowIdAndUserUUID.successCallback = successCallback;
          _this.deleteByFlowIdAndUserUUID.errorCallback   = errorCallback;
        }
      };
    });

    return _this;
  };


  var FakeResponse = function () {
    var _this = this;
    _this.send = sinon.spy();
    return _this;
  };

});
