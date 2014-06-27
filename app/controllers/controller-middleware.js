var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = {

    isAuthenticated: function (req, res, next) {
        var skynetuuid = req.headers.skynet_auth_uuid;
        var skynettoken = req.headers.skynet_auth_token;

        if (! skynetuuid || ! skynettoken) {
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