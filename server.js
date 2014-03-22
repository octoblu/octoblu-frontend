var express  = require('express');
var app      = express();
var env      = app.settings.env;
var configAuth = require('./config/auth.js')(env);
var port     = process.env.PORT || configAuth.port;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var skynetdb = require('./app/lib/skynetdb');

var configDB = require('./config/database.js')(env);
mongoose.connect(configDB.url); // connect to our database
skynetdb.connect(configDB.skynetUrl);

require('./config/passport')(env, passport); // pass passport for configuration

app.configure(function() {

    // set up our express application
    app.use(express.logger('dev')); // log every request to the console
    app.use(express.cookieParser()); // read cookies (needed for auth)
    // app.use(express.bodyParser()); // get information from html forms
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.static(__dirname + '/public'));     // set the static files location /public/img will be /img for users

    // app.set('view engine', 'jade'); // set up jade for templating

    // required for passport
    app.use(express.session({ secret: 'e2em2miotskynet' })); // session secret
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions
    app.use(flash()); // use connect-flash for flash messages stored in session

});

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('Listening on port ' + port);
