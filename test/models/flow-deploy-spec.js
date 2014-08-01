var _  = require('underscore');
var mongoose = require('mongoose');
var FlowDeploy = require('../../app/models/flow-deploy');

describe('FlowDeploy', function () {
  describe('.deploy', function () {
    it('should have a callable deploy method', function () {
      FlowDeploy.deploy();
    });
  });

  it('should instantiate', function () {
    expect(new FlowDeploy).to.exist;
  });

  describe('designerUrl', function () {
    describe('when instantiated with a particular config and user', function () {
      var sut;

      beforeEach(function () {
        var config = { host: 'http://designer.octoblu.com', port: 1025 };
        sut = new FlowDeploy({config: config, userUUID: '3838', userToken: 'something'});
      });

      it('should generate a url', function () {
        expect(sut.designerUrl()).to.equal('http://designer.octoblu.com:1025/red/3838?token=something');
      });
    });

    describe('when instantiated with a different config and user', function () {
      beforeEach(function () {
        var config = { host: 'http://localhost', port: 1880 };
        sut = new FlowDeploy({config: config, userUUID: '1234', userToken: 'something-else'});
      });

      it('should generate a url', function () {
        expect(sut.designerUrl()).to.equal('http://localhost:1880/red/1234?token=something-else');
      });
    });
  });

  describe('redport', function () {
    describe('when called with the user', function () {
      var sut, request, callback;

      beforeEach(function () {
        var config = { host: 'http://designer.octoblu.com', port: 1025 };
        request = FakeRequest;
        sut = new FlowDeploy({userUUID: '1234', userToken: 'something', request: request, config: config});
        sut.redport(callback = sinon.spy());
      });

      it('should send a put request to the designer with the designer url', function () {
        expect(request.put.calledWith[0]).to.equal('http://designer.octoblu.com:1025/red/1234?token=something');
      });

      describe('when the request responds with 1024', function () {
        beforeEach(function (done) {
          _.defer(function(){
            request.put.resolve(null, null, "1024");
            done();
          })
        });

        it('should call the callback with 1024', function () {
          expect(callback).to.have.been.calledWith('1024');
        });
      });

      describe('when the request responds with 1880', function () {
        beforeEach(function (done) {
          _.defer(function(){
            request.put.resolve(null, null, "1880");
            done();
          })
        });

        it('should call the callback with 1880', function () {
          expect(callback).to.have.been.calledWith('1880');
        });
      });
    });

    describe('with a different config and uuid', function () {
      var sut, request;

      beforeEach(function () {
        var config = { host: 'http://localhost', port: 1880 };
        request = FakeRequest;
        sut = new FlowDeploy({userUUID: 'hello', userToken: 'tolkein', request: request, config: config});
        sut.redport();
      });

      it('should send a put request to the designer with the designer url', function () {
        expect(request.put.calledWith[0]).to.equal('http://localhost:1880/red/hello?token=tolkein');
      });
    });
  });
});

var FakeRequest = {
  put: function(url, callback){
    FakeRequest.put.resolve = callback;
    FakeRequest.put.calledWith = _.values(arguments);
  }
}
