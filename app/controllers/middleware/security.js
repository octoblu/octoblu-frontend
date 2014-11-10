var _ = require('lodash'),
    User = require('../../models/user');

module.exports = {

    isAuthenticated: function (req, res, next) {
        if (req.user || req.bypassAuth) {
            return next();
        }
        var skynetuuid = decodeURIComponent(req.headers.skynet_auth_uuid),
            skynettoken = decodeURIComponent(req.headers.skynet_auth_token);

        if (!skynetuuid || !skynettoken) {
            res.json(401, {
                'error': 'unauthorized'
            });
        } else {
            User.findBySkynetUUIDAndToken(skynetuuid, skynettoken)
                .then(function (user) {
                    if (!user) {
                        return res.json(401, { 'error': 'Invalid user' })
                    }
                    req.user = user;
                    next();
                });
        }
    },
    bypassAuth: function(req, res, next) {
        req.bypassAuth = true;
        next();
    },
    bypassTerms: function(req, res, next) {
        req.bypassTerms = true;
        next();
    },
    enforceTerms: function(req, res, next) {
        if(req.bypassAuth || req.bypassTerms) {
            return next();
        }

        var terms_accepted_at = new Date(req.user.terms_accepted_at || null), // new Date(null) -> Epoch
            terms_updated_at  = new Date('2014-07-01');


        if(terms_accepted_at.getTime() >= terms_updated_at.getTime()) {
            return next();
        }

        return res.send(403, 'terms of service must be accepted');
    }
};
