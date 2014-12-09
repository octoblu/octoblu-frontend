var databaseConfig = require('./database');
var configAuth     = require('./auth.js');
var path           = require('path');
var expressSession = require('express-session');

function getExpressSession(){
  var sessionStore;
  function getNedbStore(){
    var sessionFile = path.join(databaseConfig.databaseDirectory, 'session.db');
    var connectNedb = require('connect-nedb-session');
    var NedbStore   = connectNedb(expressSession);
    return new NedbStore({ filename: sessionFile });
  }

  function getRedisStore(){
    var connectRedis = require('connect-redis');
    var RedisStore   = connectRedis(expressSession);
    return new RedisStore({ url: databaseConfig.redisSessionUrl });
  }

  switch(databaseConfig.sessionDatabase){
    case 'nedb':
      sessionStore = getNedbStore();
      break;
    case 'redis':
      sessionStore = getRedisStore();
      break;
    default:
      sessionStore = getRedisStore();
  }

  return expressSession({
    store:  sessionStore,
    secret: databaseConfig.sessionSecret,
    cookie: { domain: configAuth.domain},
    resave: true,
    saveUninitialized : true
  });
}

module.exports = getExpressSession();
