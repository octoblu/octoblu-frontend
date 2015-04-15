var path = require('path');

var config = {
    development: {
        sessionSecret: 'e2em2miotskynetZOMGBBQ',
        sessionDatabase : 'redis', // redis or nedb
        databaseType: 'mongodb', // mongodb or nedb
        databaseDirectory : path.join(__dirname, '../database'),
        url : process.env.OCTOBLU_DB || 'mongodb://localhost:27017/meshines',
        mongojsUrl : process.env.OCTOBLU_DB || 'mongodb://localhost:27017/meshines',
        redisSessionUrl: process.env.REDIS_SESSION_URI || 'redis://localhost'
    },
    test: {
        sessionSecret: 'e2em2miotskynetZOMGBBQ',
        sessionDatabase : 'redis',
        databaseType : 'mongodb',
        url: 'mongodb://localhost:27017/octoblu_test',
        mongojsUrl: 'mongodb://localhost:27017/octoblu_test',
        redisSessionUrl: 'redis://localhost/test-octoblu-session'
    },
    staging: {
        sessionSecret: 'e2em2miotskynetZOMGBBQ',
        sessionDatabase : 'redis',
        databaseType : 'mongodb',
        url : 'mongodb://172.31.33.28:27017/octoblu-staging,mongodb://172.31.38.108:27017/octoblu-staging,mongodb://172.31.32.97:27017/octoblu-staging',
        mongojsUrl : '172.31.33.28,172.31.38.108,172.31.32.97/octoblu-staging?slaveOk=true',
        redisSessionUrl: process.env.REDIS_URL || 'redis://staging-redis.csy8op.0001.usw2.cache.amazonaws.com'
    },
    production: {
        sessionSecret: 'e2em2miotskynetZOMGBBQ',
        sessionDatabase : 'redis',
        databaseType : 'mongodb',
        url : 'mongodb://172.31.33.28:27017/octoblu,mongodb://172.31.38.108:27017/octoblu,mongodb://172.31.32.97:27017/octoblu',
        mongojsUrl : '172.31.33.28,172.31.38.108,172.31.32.97/octoblu?slaveOk=true',
        redisSessionUrl: process.env.REDIS_URL || 'redis://meshblu-redis.csy8op.0001.usw2.cache.amazonaws.com'
    },
    nedb: {
        sessionSecret: 'e2em2miotskynetZOMGBBQ',
        sessionDatabase : 'nedb', // nedb or nedb
        databaseType: 'nedb', // nedb or nedb
        databaseDirectory : path.join(__dirname, '../database')
    }
};

module.exports = config[process.env.NODE_ENV] || config['development'];
