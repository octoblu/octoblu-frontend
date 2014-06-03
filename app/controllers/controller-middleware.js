var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = {

    isAuthenticated: function (req, res, next) {
        var skynetuuid = req.headers.ob_skynetuuid;
        var skynettoken = req.headers.ob_skynettoken;

        if (!skynetuuid || !skynettoken) {
            res.json(401, {
                'error': 'unauthorized'
            });
        } else {
            User.findBySkynetUUIDAndToken(skynetuuid, skynettoken)
                .then(function (user) {

                    if (!user) {
                        res.json(401, { 'error': 'Invalid user' })
                    }
                    req.user = user;
                    next();
                });
        }
    }

};