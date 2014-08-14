var OauthController = function(options) {
  var _this, oauthService;
  _this = this; // WARNING: WORKING AROUND THE LANGUAGE!

  options = options || {};
  oauthService = options.oauthService;

  _this.handleRedirect = function(req, res) {
    oauthService.getRedirectUrl();
    res.redirect('http://google.com');
  }

  return _this;
}

module.exports = OauthController
