var config = {
  development: {
    // url: 'mongodb://localhost:27017/octoblu-development'
    url : 'mongodb://[user]:[password]@dharma.mongohq.com:10040/meshines'
  },
  test: {
    url: 'mongodb://loclahost:27017/octoblu-test'
  },
  production: {
    url : 'mongodb://[user]:[password]@dharma.mongohq.com:10040/meshines'
  }
};

module.exports = function (environment) {
  return config[environment];
};
