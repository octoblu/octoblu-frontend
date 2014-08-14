var config = {
    development: {
        url : process.env.OCTOBLU_DB || 'mongodb://localhost:27017/meshines',
        skynetUrl: process.env.SKYNET_DB || 'mongodb://localhost:27017/skynet',
        redisSessionUrl: process.env.REDIS_SESSION_URI || 'redis://localhost'
    },
    test: {
        url: 'mongodb://localhost:27017/meshines',
        skynetUrl: 'mongodb://localhost:27017/skynet-test',
        redisSessionUrl: 'redis://localhost/test-octoblu-session'
    },
    staging: {
        url : 'mongodb://172.31.33.28:27017/octoblu-staging,mongodb://172.31.38.108:27017/octoblu-staging,mongodb://172.31.32.97:27017/octoblu-staging',
        skynetUrl : 'mongodb://172.31.33.28:27017/meshblu-staging,mongodb://172.31.38.108:27017/meshblu-staging,mongodb://172.31.32.97:27017/meshblu-staging',
        redisSessionUrl: 'redis://staging-redis.csy8op.0001.usw2.cache.amazonaws.com'
    },
    production: {
        url : 'mongodb://172.31.33.28:27017/octoblu,mongodb://172.31.38.108:27017/octoblu,mongodb://172.31.32.97:27017/octoblu',
        skynetUrl : 'mongodb://172.31.33.28:27017/meshblu,mongodb://172.31.38.108:27017/meshblu,mongodb://172.31.32.97:27017/meshblu',
        redisSessionUrl: 'redis://meshblu-redis.csy8op.0001.usw2.cache.amazonaws.com'
    }
};

module.exports = function (environment) {
    return config[environment];
};
