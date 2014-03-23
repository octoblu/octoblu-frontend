'use strict';

module.exports = function ( app ) {
    app.get('/*', function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        if (req.headers.host.match(/^www/) !== null) {
            res.redirect('http://' + req.headers.host.replace(/^www\./, '') + req.url);
        } else {
            return next();
        }
    });
};
