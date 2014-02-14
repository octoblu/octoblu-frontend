var development = true;
if (development) {

  // expose our config directly to our application using module.exports
  module.exports = {

    // DEVELOPMENT
    'facebookAuth' : {
      'clientID'    : '244672615710168', // your App ID
      'clientSecret'  : '936b46491b2f10ac4f9941329d68b3bb', // your App Secret
      'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
      'consumerKey'     : '2GFvhpzG7PzDAiommSLIg',
      'consumerSecret'  : 'PMftByICxSfbvf7rPqfivAocDE25a0EqZGDkMbKh6Q',
      'callbackURL'     : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
      'clientID'    : '541650856544-9rka38kfvik59jb6j3denspgjn202lcv.apps.googleusercontent.com',
      'clientSecret'  : 'VE5h4f7DAh4Z5jQgscPFVIZk',
      'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    },
    'linkedIn' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/LinkedIn/callback'
    },
    'readability' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'stackexchange' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'bitly' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'vimeo' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'foursquare' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'tumblr' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'fitbit' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'rdio' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'port' : 8080,
    'domain': null
  }

} else {

  module.exports = {
    // PRODUCTION
    'facebookAuth' : {
      'clientID'    : 'INSERT_SECERT_HERE', // your App ID
      'clientSecret'  : 'INSERT_SECERT_HERE', // your App Secret
      'callbackURL'   : 'http://octoblu.com/auth/facebook/callback'
    },

    'twitterAuth' : {
      'consumerKey'     : '2GFvhpzG7PzDAiommSLIg',
      'consumerSecret'  : 'PMftByICxSfbvf7rPqfivAocDE25a0EqZGDkMbKh6Q',
      'callbackURL'     : 'http://octoblu.com/auth/twitter/callback'
    },
    // // Meshines
    // 'googleAuth' : {
    //   'clientID'    : '541059729530-bbt3n8qh5s8c8m5dm7dh6gojiqqrfrbg.apps.googleusercontent.com',
    //   'clientSecret'  : 'SVTqhJ7RtsK6zqRcKUZrjxM6',
    //   'callbackURL'   : 'http://octoblu.com/auth/google/callback'
    // },
    // Octoblu
    'googleAuth' : {
      'clientID'    : '369178117909-psv35jjicbu961aj4ups6h5s2mb08j6m.apps.googleusercontent.com',
      'clientSecret'  : 'bgqPgsEjZC_F65rKDxp7PwRQ',
      'callbackURL'   : 'http://octoblu.com/auth/google/callback'
    },
    'linkedIn' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/LinkedIn/callback'
    },
    'readability' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Readability/callback'
    },
    'stackexchange' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/StackOverflow/callback'
    },
    'bitly' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Bitly/callback'
    },
    'vimeo' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Vimeo/callback'
    },
    'foursquare' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/FourSquare/callback'
    },
    'tumblr' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Tumblr/callback'
    },
    'fitbit' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/FitBit/callback'
    },
    'rdio' : {
      'consumerKey'    : '75athujre0gp76',
      'consumerSecret' : 'hwApG57HKsQrBYAL',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'port' : 80,
    'domain': '.octoblu.com'
  }

};