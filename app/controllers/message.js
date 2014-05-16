'use strict';

var request = require('request');

module.exports = function (app) {
    app.post('/api/message', function(req, res) {
        console.log({"devices": req.body.uuid, "message": {"text": req.body.message}});

        request.post(req.protocol + '://' + app.locals.skynetUrl +'/messages',
            {form: {"devices": req.body.uuid, 
                "message": req.body.message}
            , headers: {
                'skynet_auth_uuid': req.body.uuid,
                'skynet_auth_token': req.query.uuid
            }}
            , function (error, response, body) {
                console.log(body);
                var data = JSON.parse(body);
                res.json(data);
            });

    });
};
