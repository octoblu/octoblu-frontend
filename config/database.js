var config = {
    rh: {
        url: 'mongodb://localhost:27017/octoblu-development',
        skynetUrl: 'mongodb://localhost:27017/skynet-development'
    },
    development: {
        url : 'mongodb://[user]:[password]@dharma.mongohq.com:10040/meshines',
        skynetUrl: 'mongodb://localhost:27017/skynet-development'
    },
    test: {
        url: 'mongodb://localhost:27017/octoblu-test',
        skynetUrl: 'mongodb://localhost:27017/skynet-test'
    },
    production: {
        url : 'mongodb://[user]:[password]@dharma.mongohq.com:10040/meshines',
        skynetUrl: 'mongodb://54.186.148.255:27017/skynet'
    }
};

module.exports = function (environment) {
    return config[environment];
};
