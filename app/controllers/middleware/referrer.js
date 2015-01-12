module.exports = {
  redirectToReferrer: function(req, res, next) {
    if (req.user && req.referrer) {
      var uuid = encodeURIComponent(req.user.skynet.uuid),
        token = encodeURIComponent(req.user.skynet.token);
      res.redirect(req.referrer + '?uuid=' + uuid + '&token=' + token);
    } else {
      next();
    }
  },
  restoreReferrer: function(req, res, next) {
    req.referrer = req.session.referrer;
    req.mobile = req.session.mobiler;
    req.sqrtofsaturn = req.session.sqrtofsaturn;
    delete req.session.referrer;
    delete req.session.mobile;
    delete req.session.sqrtofsaturn;
    next();
  },
  storeReferrer: function(req, res, next) {
    req.session.referrer = req.query.referrer;
    req.session.mobile = req.query.mobile;
    req.session.sqrtofsaturn = req.query.sqrtofsaturn;
    delete req.query.referrer;
    delete req.query.mobile;
    delete req.query.sqrtofsaturn;
    next();
  }
};