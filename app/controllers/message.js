'use strict';

var request = require('request');

module.exports = function (app) {
    app.post('/api/message', function(req, res) {
        console.log({"fromUuid": req.body.fromUuid, "fromToken": req.body.fromToken, "to": req.body.toUuid, "message": req.body.message});

        request.post(req.protocol + '://' + app.locals.skynetUrl +'/messages',
            {form: {"devices": req.body.toUuid, 
                "subdevice": req.body.message.subdevice,
                "payload": req.body.message.payload}
            , headers: {
                'skynet_auth_uuid': req.body.fromUuid,
                'skynet_auth_token': req.body.fromToken
            }}
            , function (error, response, body) {
                console.log(body);
                var data = JSON.parse(body);
                res.json(data);
            });

    });
};
