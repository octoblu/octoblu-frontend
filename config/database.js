var config = {
    development: {
        url : process.env.OCTOBLU_DB || 'mongodb://localhost:27019/meshines',
        skynetUrl: process.env.SKYNET_DB || 'mongodb://localhost:27019/skynet',
        redisSessionUrl: process.env.REDIS_SESSION_URI || 'redis://localhost'
    },
    test: {
        url: 'mongodb://localhost:27019/meshines',
        skynetUrl: 'mongodb://localhost:27019/skynet-test',
        redisSessionUrl: 'redis://localhost/test-octoblu-session'
    },
    staging: {
        // url : 'mongodb://[user]:[password]@dharma.mongohq.com:10040/meshines'
        url : 'mongodb://localhost:27019/meshines',
        skynetUrl: 'mongodb://localhost:27019/skynet',
        redisSessionUrl: 'redis://meshblu-redis.csy8op.0001.usw2.cache.amazonaws.com'
    },
    production: {
        // url : 'mongodb://[user]:[password]@dharma.mongohq.com:10040/meshines'
        url : 'mongodb://localhost:27019/meshines',
        skynetUrl: 'mongodb://localhost:27019/skynet',
        redisSessionUrl: 'redis://meshblu-redis.csy8op.0001.usw2.cache.amazonaws.com'
    }
};

module.exports = function (environment) {
    return config[environment];
};
