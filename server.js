'use strict';

if ((process.env.USE_NEWRELIC  || 'false').toLowerCase() === 'true') {
  require('newrelic');
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

require('./config/passport')(env, passport); // pass passport for configuration
passport.use(require('./config/app-net'));
passport.use(require('./config/bitly'));
passport.use(require('./config/box'));
passport.use(require('./config/dropbox'));
passport.use(require('./config/facebook'));
passport.use(require('./config/fitbit'));
passport.use(require('./config/foursquare'));
passport.use(require('./config/github'));
passport.use(require('./config/google'));
passport.use(require('./config/gotomeeting'));
passport.use(require('./config/instagram'));
passport.use(require('./config/jawbone'));
passport.use(require('./config/linked-in'));
passport.use(require('./config/local'));
passport.use(require('./config/nest'));
passport.use(require('./config/paypal'));
passport.use(require('./config/podio'));
passport.use(require('./config/quickbooks'));
passport.use(require('./config/rdio'));
passport.use(require('./config/readability'));
passport.use(require('./config/redbooth'));
passport.use(require('./config/salesforce'));
passport.use(require('./config/sharefile'));
passport.use(require('./config/smartsheet'));
passport.use(require('./config/spotify'));
passport.use(require('./config/survey-monkey'));
passport.use(require('./config/twitter'));
passport.use(require('./config/uservoice'));
passport.use(require('./config/vimeo'));
passport.use(require('./config/withings'));
passport.use(require('./config/wordpress'));
passport.use(require('./config/xero'));
passport.use(require('./config/zendesk'));

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
