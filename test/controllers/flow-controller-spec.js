var FlowController = require('../../app/controllers/flow-controller');
var _ = require('lodash');
var when = require('when');

describe('FlowController', function () {
  var sut, res, flow, Flow, meshblu;

  beforeEach(function () {
    Flow = new FakeFlow();
    meshblu = {meshblu: true};
    sut = new FlowController({Flow: Flow, meshblu: meshblu});
    res = new FakeResponse();
  });

  describe('create', function() {
    beforeEach(function() {
      req = {body: {foo: 'bar'}, user: {resource: {uuid: '5'}}};
      sut.create(req, res);
    });

    it('should call Flow.createByUserUUID', function(){
      expect(Flow.createByUserUUID).to.have.been.calledWith('5', req.body, meshblu);
    });

    describe('when the Flow responds with a success', function () {
      beforeEach(function () {
        Flow.createByUserUUID.successCallback();
      });

      it('should return a 201', function() {
        expect(res.send).to.have.been.calledWith(201);
      });
    });

    describe('when the Flow responds with a failure', function () {
      beforeEach(function () {
        Flow.createByUserUUID.errorCallback();
      });

      it('should return a 422', function() {
        expect(res.send).to.have.been.calledWith(422);
      });
    });
  });

  describe('update', function () {
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
        sut.update(req, res);
      });

      it('should call updateByFlowIdAndUser on Flow', function () {
        expect(Flow.updateByFlowIdAndUser).to.have.been.called;
      });

      it('should call updateByFlowIdAndUser with the id and body', function () {
        expect(Flow.updateByFlowIdAndUser).to.have.been.calledWith(123, '233435', {foo: 'bar'});
      });

      it('should not call response.send', function () {
        expect(res.send.called).not.to.be.true;
      });

      describe('when the Flow responds with a success', function () {
        beforeEach(function () {
          Flow.updateByFlowIdAndUser.successCallback();
        });

        it('should respond with a 204', function () {
          expect(res.send).to.have.been.calledWith(204);
        });
      });

      describe('when the Flow responds with a error', function () {
        beforeEach(function () {
          Flow.updateByFlowIdAndUser.errorCallback();
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
        sut.update(req, res);
      });

      it('should call updateByFlowIdAndUser with the id and body', function () {
        expect(Flow.updateByFlowIdAndUser).to.have.been.calledWith(456, 'abcde', {foo: 'widget'});
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
      expect(Flow.deleteByFlowIdAndUserUUID).to.be.have.been.calledWith('5', '1');
    });

    describe('when fake flow calls the success callback', function () {
      beforeEach(function(){
        Flow.deleteByFlowIdAndUserUUID.successCallback('some error');
      });

      it('should respond with a 204 and no content', function () {
        expect(res.send).to.have.been.calledWith(204);
      });
    });

    describe('when fake flow calls the error callback', function () {
      beforeEach(function(){
        Flow.deleteByFlowIdAndUserUUID.errorCallback('some error');
      });

      it('should response with a 500 and the error', function () {
        expect(res.send).to.have.been.calledWith(500, 'some error');
      });
    });
  });

  var FakeFlow = function () {
    var self = this;

    self.createByUserUUID = sinon.spy(function() {
      return {
        then: function (successCallback, errorCallback) {
          self.createByUserUUID.successCallback = successCallback;
          self.createByUserUUID.errorCallback   = errorCallback;
        }
      }
    });

    self.updateByFlowIdAndUser = sinon.spy(function () {
      return {
        then: function (successCallback, errorCallback) {
          self.updateByFlowIdAndUser.successCallback = successCallback;
          self.updateByFlowIdAndUser.errorCallback   = errorCallback;
        }
      };
    });

    self.deleteByFlowIdAndUserUUID = sinon.spy(function () {
      return {
        then: function (successCallback, errorCallback) {
          self.deleteByFlowIdAndUserUUID.successCallback = successCallback;
          self.deleteByFlowIdAndUserUUID.errorCallback   = errorCallback;
        }
      };
    });

    return self;
  };


  var FakeResponse = function () {
    var _this = this;
    _this.send = sinon.spy();
    return _this;
  };

});
