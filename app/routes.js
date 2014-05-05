module.exports = function(app, passport) {
    // Setup config
    var env = app.settings.env;
    var config = require('../config/auth')(env);
    var skynet = require('skynet');

    console.log('Connecting to SkyNet...');

    // Generic UUID / Token for SkyNet API calls
    var conn = skynet.createConnection({
        "uuid": "9b47c2f1-9d9b-11e3-a443-ab1cdce04787",
        "token": "pxdq6kdnf74iy66rhuvdw9h5d2f0f6r",
        "protocol": "websocket"
    });

    conn.on('notReady', function(data){
        console.log('SkyNet authentication: failed');
    });

    // Attach additional routes
    conn.on('ready', function(data){
        console.log('SkyNet authentication: success');

        // Initialize Controllers
        require('./controllers/auth')(app, passport, config);
        require('./controllers/channel')(app);
        require('./controllers/connect')(app, passport, config);
        require('./controllers/cors')(app);
        require('./controllers/device')(app);
        require('./controllers/elastic')(app);
        require('./controllers/message')(app, conn);
        require('./controllers/owner')(app, conn);
        require('./controllers/redport')(app);
        require('./controllers/session')(app, passport, config);
        require('./controllers/unlink')(app);
        require('./controllers/user')(app);
        require('./controllers/designer')(app);

        // Check for deeplink redirect > http://localhost:8080/login?referrer=http:%2F%2Flocalhost%2Fauth.js
        app.get('/login', function(req, res) {
          // console.log(req.query.referrer);
            // Check for deep link redirect based on referrer in querystring
            if(req.session.redirect){
                return res.redirect(req.session.redirect + '?uuid=' + data.uuid + '&token=' + data.token);
            } else {          
                req.session.redirect = req.query.referrer;
                res.sendfile('./public/index.html');
            }
        });


        // show the home page (will also have our login links)
        app.get('/*', function(req, res) {
            res.sendfile('./public/index.html');
        });
    }); // end skynet
};
