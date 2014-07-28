'use strict';

var request = require('request');

// Get devices by owner
module.exports = function (app, config) {
    // Get nodered port

    app.get('/api/redport/:uuid/:token', function(req, res) {
        // curl -X PUT http://red.meshines.com:4444/red/aaa?token=bbb

        console.log(config);
        if(config.designer.docker_port) {
            return res.json(config.designer.docker_port);
        }

        var url = config.designer.host + ':' + config.designer.port;
        request.put(url + '/red/' + req.params.uuid,
            {qs: {'token': req.params.token}},
            function (error, response, body) {
                // console.log(body);
                res.json(body);
            });
    });
};
