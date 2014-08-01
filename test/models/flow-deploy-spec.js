var FlowDeploy = require('../../app/models/flow-deploy');
var _  = require('underscore');

describe('FlowDeploy', function () {

  describe('.deploy', function () {
    it('should have a callable deploy method', function () {
      FlowDeploy.deploy();
    });
  });

  it('should instantiate', function () {
    expect(new FlowDeploy).to.exist;
  });

  describe('redport', function () {
    describe('when sut has a userSkynetUuid of 1234', function () {
      var sut, request;

      beforeEach(function () {
        var config = { host: 'http://designer.octoblu.com', port: 1025 };
        request = FakeRequest;
        sut = new FlowDeploy({userUUID: '1234', request: request, config: config});
        sut.redport();
      });

      it('should send a put request to the designer with the designer url', function () {
        expect(request.put.calledWith[0]).to.equal('http://designer.octoblu.com:1025/red/1234?asdf');
      });
    });

    describe('with a different config and uuid', function () {
      var sut, request;

      beforeEach(function () {
        var config = { host: 'http://localhost', port: 1880 };
        request = FakeRequest;
        sut = new FlowDeploy({userUUID: 'hello', request: request, config: config});
        sut.redport();
      });

      it('should send a put request to the designer with the designer url', function () {
        expect(request.put.calledWith[0]).to.equal('http://localhost:1880/red/hello?asdf');
      });
    });
  });
});

var FakeRequest = {
  put: function(url, options, callback){
    FakeRequest.put.resolve = callback;
    FakeRequest.put.calledWith = _.values(arguments);
  }
}
