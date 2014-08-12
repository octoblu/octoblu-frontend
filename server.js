var express        = require('express');
var http           = require('http');
var https          = require('https');
var morgan         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var expressSession = require('express-session');
var cors           = require('cors');
var mongoose       = require('mongoose');
var passport       = require('passport');
var flash          = require('connect-flash');
var skynetdb       = require('./app/lib/skynetdb');
var connectRedis   = require('connect-redis');
var fs             = require('fs');
var privateKey     = fs.readFileSync('config/server.key', 'utf8');
var certificate    = fs.readFileSync('config/server.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var app        = express();
var env        = app.settings.env;
var configAuth = require('./config/auth.js')(env);
var port       = process.env.OCTOBLU_PORT || configAuth.port;
var sslPort    = process.env.OCTOBLU_SSLPORT || configAuth.sslPort;

var configDB = require('./config/database.js')(env);
mongoose.connect(configDB.url); // connect to our database
skynetdb.connect(configDB.skynetUrl);
var RedisStore = connectRedis(expressSession);
// Initialize Models

//moved all the models initialization into here, because otherwise when we include the schema twice,
//mongoose blows up because the model is duplicated.
require('./initializeModels.js');

require('./config/passport')(env, passport); // pass passport for configuration


// set up our express application
app.use(morgan('dev', {immediate:false})); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)


// app.use(express.bodyParser()); // get information from html forms
// app.use(bodyParser());
// increasing body size for resources
app.use(bodyParser({limit: '50mb'}));

app.use(express.static(__dirname + '/public'));     // set the static files location /public/img will be /img for users

// app.set('view engine', 'jade'); // set up jade for templating

// required for passport
app.use(expressSession({
        store:  new RedisStore({url: configDB.redisSessionUrl}),
        secret: 'e2em2miotskynet',
        cookie: { domain: configAuth.domain}
    })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(cors());

require('./app/routes.js')(app, passport);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(port, function(){
    console.log('Listening on port ' + port);
});

httpsServer.listen(sslPort, function() {
  console.log('HTTPS listening on', sslPort);
});
