var config = {
  development: {
    // url : 'mongodb://[user]:[password]@dharma.mongohq.com:10040/meshines'
    url : 'mongodb://54.186.148.255:27017/meshines'
  },
  test: {
    url: 'mongodb://localhost:27017/meshines'
  },
  production: {
    // url : 'mongodb://[user]:[password]@dharma.mongohq.com:10040/meshines'
    url : 'mongodb://54.186.148.255:27017/meshines'
  }
};

module.exports = function (environment) {
  return config[environment];
};
