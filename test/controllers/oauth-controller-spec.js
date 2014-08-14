var OauthController = require('../../app/controllers/oauth-controller');

describe('OauthController', function () {
  it('should instantiate', function () {
    var sut = new OauthController();
    expect(sut).to.exist;
  });

  describe('.handleRedirect', function () {
    var sut, fakeOauthService, fakeResponse;


    describe('google oauth', function () {
      beforeEach(function () {
        fakeOauthService = new FakeOauthService();
        sut              = new OauthController({oauthService: fakeOauthService});
        fakeResponse     = new FakeResponse();

        sut.handleRedirect(null, fakeResponse);
      });
      it('should redirect', function() {
        expect(fakeResponse.redirect).to.have.been.calledWith('http://google.com');
      });
    });

    it('should redirect', function() {
      expect(fakeResponse.redirect).to.have.been.calledWith('http://yahoo.com');
    });

    it('should call getRedirectUrl on the fakeOauthService', function () {
      expect(fakeOauthService.getRedirectUrl).to.have.been.called;
    });
  });
});

var FakeOauthService  = function(){
  var _this = this;

  _this.getRedirectUrl = sinon.spy();

  return _this;
}

var FakeResponse  = function(){
  var _this = this;

  _this.redirect = sinon.spy();

  return _this;
}
