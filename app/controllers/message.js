'use strict';

var request = require('request');

module.exports = function (app) {
    app.post('/api/message', function(req, res) {
        console.log({"devices": req.body.uuid, "message": {"text": req.body.message}});

        request.post(req.protocol + '://' + app.locals.skynetUrl +'/messages',
            {form: {"devices": req.body.uuid, "message": req.body.message}}
            , function (error, response, body) {
                console.log(body);
                var data = JSON.parse(body);
                res.json(data);
            });

    });
};
