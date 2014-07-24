var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

module.exports = {

    isAuthenticated: function (req, res, next) {
        if (req.user) {
            next();
        } else {            
            var skynetuuid = decodeURIComponent(req.headers.skynet_auth_uuid),
                skynettoken = decodeURIComponent(req.headers.skynet_auth_token);
            
            if (!skynetuuid || !skynettoken) {
                res.json(401, {
                    'error': 'unauthorized'
                });
            } else {
                console.log('finding user by header data');
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
    }
};