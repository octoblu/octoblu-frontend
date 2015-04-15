'use strict';
require('coffee-script/register');

if ((process.env.USE_NEWRELIC  || 'false').toLowerCase() === 'true') {
  require('newrelic');
}

if ((process.env.USE_APP_DYNAMICS || 'false').toLowerCase() === 'true') {
  require('./config/appdynamics.js');
}

var express        = require('express');
var path           = require('path');
var errorhandler   = require('errorhandler');
var http           = require('http');
var https          = require('https');
var morgan         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var cors           = require('cors');
var passport       = require('passport');
var flash          = require('connect-flash');
var fs             = require('fs');
var privateKey     = fs.readFileSync('config/server.key', 'utf8');
var certificate    = fs.readFileSync('config/server.crt', 'utf8');
var credentials    = {key: privateKey, cert: certificate};
var app            = express();
var env            = app.settings.env;
var configAuth     = require('./config/auth.js');
var port           = process.env.OCTOBLU_PORT || configAuth.port;
var sslPort        = process.env.OCTOBLU_SSLPORT || configAuth.sslPort;
var databaseConfig = require('./config/database');
var meshbluHealthcheck = require('express-meshblu-healthcheck');


if (process.env.AIRBRAKE_KEY) {
  var airbrake = require('airbrake').createClient(process.env.AIRBRAKE_KEY);
  app.use(airbrake.expressHandler());
} else {
  process.on('uncaughtException', function(error) {
    console.error(error.message, error.stack);
  });
}

var databaseOptions = {
	collections : [
		'invitations'
	]
};

var octobluDB = require('./app/lib/database');
octobluDB.createConnection(databaseOptions);

// Initialize Models

//moved all the models initialization into here, because otherwise when we include the schema twice,

var PassportStrategyLoader = require('./config/passport-strategy-loader');
var passportStrategyLoader = new PassportStrategyLoader();
passportStrategyLoader.load();

app.use(meshbluHealthcheck())
// set up our express application
app.use(morgan('dev', {immediate:false})); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// app.use(express.bodyParser()); // get information from html forms
// app.use(bodyParser());
// increasing body size for resources
app.use(bodyParser.urlencoded({ extended : true, limit : '50mb' }));

app.use(bodyParser.json({ limit : '50mb' }));

app.use(express.static(__dirname + '/public'));

var expressSession = require('./config/session');

app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(cors());
if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}

require('./app/routes.js')(app, passport);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(port, function(){
  console.log('HTTP listening on port ' + port);
});

httpsServer.listen(sslPort, function() {
  console.log('HTTPS listening on port ' + sslPort);
});
