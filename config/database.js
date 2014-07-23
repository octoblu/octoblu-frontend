var config = {
    development: {
        // url : 'mongodb://[user]:[password]@dharma.mongohq.com:10040/meshines'
        url : process.env.OCTOBLU_DB || 'mongodb://localhost:27017/meshines',
        skynetUrl: process.env.SKYNET_DB || 'mongodb://localhost:27017/skynet',
        redisSessionUrl: process.env.REDIS_SESSION_URI || 'redis://localhost'
    },
    test: {
        url: 'mongodb://localhost:27017/meshines',
        skynetUrl: 'mongodb://localhost:27017/skynet-test',
        redisSessionUrl: 'redis://localhost/test-octoblu-session'
    },
    production: {
        // url : 'mongodb://[user]:[password]@dharma.mongohq.com:10040/meshines'
        url : 'mongodb://localhost:27017/meshines',
        skynetUrl: 'mongodb://localhost:27017/skynet',
        redisSessionUrl: 'redis://localhost'
    }
};

module.exports = function (environment) {
    console.log(environment);
    return config[environment];
};
