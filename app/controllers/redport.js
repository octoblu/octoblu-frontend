'use strict';

var request = require('request');

// Get devices by owner
module.exports = function (app) {
    // Get nodered port
    app.get('/api/redport/:uuid/:token', function(req, res) {
        // curl -X PUT http://red.meshines.com:4444/red/aaa?token=bbb
        request.put('http://designer.octoblu.com:1025/red/' + req.params.uuid,
            {qs: {'token': req.params.token}},
            function (error, response, body) {
                // console.log(body);
                res.json(body);
            });
    });
};