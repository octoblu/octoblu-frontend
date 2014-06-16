module.exports = function(app, passport) {
    // Setup config
    var env = app.settings.env;
    var config = require('../config/auth')(env);
    var skynet = require('skynet');

    //set the skynetUrl
    app.locals.skynetUrl = config.skynet.host + ':' + config.skynet.port;

    console.log('Connecting to SkyNet...');

    // Generic UUID / Token for SkyNet API calls
    var conn = skynet.createConnection({
        "uuid": "9b47c2f1-9d9b-11e3-a443-ab1cdce04787",
        "token": "pxdq6kdnf74iy66rhuvdw9h5d2f0f6r",
        'server' : config.skynet.host,
        'port'   : config.skynet.port ,
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
        require('./controllers/device')(app, config);
        require('./controllers/elastic')(app);
        require('./controllers/message')(app, conn);
        require('./controllers/owner')(app, config, conn);
        require('./controllers/redport')(app);
        require('./controllers/session')(app, passport, config);
        require('./controllers/unlink')(app);
        require('./controllers/user')(app);
        require('./controllers/group')(app);
        require('./controllers/permissions')(app);
        require('./controllers/designer')(app);
        require('./controllers/invitation')(app, passport, config);

        // Check for deeplink redirect > http://localhost:8080/login?referrer=http:%2F%2Flocalhost%2Fauth.js
        app.get('/login', function(req, res) {
          // console.log(req.query.referrer);
            // Check for deep link redirect based on referrer in querystring
            if(req.query.referrer && req.query.referrer.length){
                if(req.cookies.skynetuuid && req.cookies.skynettoken){
                    return res.redirect(req.query.referrer + '?uuid=' + req.cookies.skynetuuid + '&token=' + req.cookies.skynettoken);
                }
                req.session.redirect = req.query.referrer;
            }

            res.sendfile('./public/index.html');
        });

        // show the home page (will also have our login links)
        app.get('/*', function(req, res) {
            res.sendfile('./public/index.html');
        });
    }); // end skynet
};
