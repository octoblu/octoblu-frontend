var OauthController = require('../../app/controllers/oauth-controller');

describe('OauthController', function () {
  it('should instantiate', function () {
    var sut = new OauthController();
    expect(sut).to.exist;
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
