var databaseConfig = require('./database')();
var configAuth     = require('./auth.js')();
var path           = require('path');
var fs             = require('fs');
var octobluDB      = require('../app/lib/database');
var expressSession = require('express-session');

var sessionFile = path.join(databaseConfig.databaseDirectory, 'session.db');

function canConnecToNedb(callback){
  fs.open(sessionFile, 'w+', function (err, fd) {
    if (err) {
      if (err.code === "EACCESS") {
        return callback(null, false);
      }
      console.error(err);
      process.exit(1);
    }
    fs.close(fd, function (err) {
      if (err) return callback(err);
      callback(null, true);
    });
  });
}

function getNedbStore(callback){
  canConnecToNedb(function(){
    var connectNedb = require('connect-nedb-session');
    var NedbStore   = connectNedb(expressSession);
    callback(new NedbStore({ filename:  sessionFile }));
  });
}

function canConnectToRedis(callback){
  var client = require('redis').createClient();
  client.on('error', function(err){
    console.log('Unable to connect to redis. Please change database config to use nedb.');
    console.error(err);
    process.exit(1);
  });
  client.on('connect', callback);
}

function getRedisStore(callback){
  canConnectToRedis(function(){
    var connectRedis = require('connect-redis');
    var RedisStore   = connectRedis(expressSession);
    callback(new RedisStore({url: octobluDB.config.redisSessionUrl}));
  });
}
module.exports = function(app){
  function useSessionStore(sessionStore){
    app.use(expressSession({
        store:  sessionStore,
        secret: 'e2em2miotskynet',
        cookie: { domain: configAuth.domain},
        resave: true,
        saveUninitialized : true
    }));
  }

  if(databaseConfig.sessionDatabase === 'nedb'){
    getNedbStore(useSessionStore);
  }else{
    getRedisStore(useSessionStore);
  }

};
