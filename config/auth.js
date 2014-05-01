var config = {
  rh: {
  },
  development: {
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
    'stackexchange' : {
      'clientId'       : '2619',
      'clientKey'    : 'je)EAcFS8nB0JYVrAJ0zWw((',
      'clientSecret'   : 'OlbENW0n3RlpTLwLCicYgA((',
      'callbackURL'    : 'http://localhost:8080/api/auth/StackOverflow/callback'
    },
    'bitly' : {
      'clientId'       : '1c55f213d790c4b5efc3ab67520d71926daf33fe',
      'clientSecret'    : 'e07a564eca8414628833830ea3c42800f16aef98',
      'callbackURL'    : 'http://localhost:8080/api/auth/Bitly/callback'
    },
    'foursquare' : {
      'clientKey'    : '0FHIAV0KFBVSBNYAXBKYMZY4HE0CMBTXLIBG0TGZLQ0TRJYB',
      'clientSecret' : '3XRB1YRDIP1WYTUXZWZPN5IE5OLXV0GIBQT1VYZYDFMKGWX4',
      'callbackURL'    : 'http://localhost:8080/api/auth/FourSquare/callback'
    },
    'tumblr' : {
      'consumerKey'    : 'XbAAewbcTCBuTulBPksJRwgH4ESS0B87051HK3OhTnmDI73Pbb',
      'consumerSecret' : '1XKq2MgOZTWBC5me8NAvZyVQxkgn7xSMOM1YWaa2LG8XQV2sqs',
      'callbackURL'    : 'http://localhost:8080/api/auth/Tumblr/callback'
    },
    'rdio' : {
      'consumerKey'    : '8xrf6qedwvp2m5zmwrrhbb2j',
      'consumerSecret' : 'E5EbEc5vdf',
      'callbackURL'    : 'http://localhost:8080/api/auth/Rdio/callback'
    },
    'lastfm' : {
      'consumerKey'    : 'c034d4839dfa3e855f610145d1ecb819',
      'consumerSecret' : 'd02830cccb806daada107f8a1f1b3777',
      'base_url'       : 'http://www.last.fm/api/auth/',
      'callbackURL'    : 'http://localhost:8080/api/auth/LastFM/callback'
    },
    'delicious' : {
      'consumerKey'    : 'e9e36c5c7ab86dd3a33cccafa2c9afbb',
      'consumerSecret' : 'fc69b39b321995c141ecf4e30207b0a2',
      'base_url'       : 'https://delicious.com/',
      'callbackURL'    : 'http://localhost:8080/api/auth/Delicious/callback'
    },
    'musixmatch' : {
      'base_url'       : 'http://api.musixmatch.com/ws/1.1/',
    },
    email : {

    },
    'port' : 8080,
    'domain': null

  },
  test: {

  },
  production: {
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
    'stackexchange' : {
      'clientId'       : '2619',
      'clientKey'    : 'je)EAcFS8nB0JYVrAJ0zWw((',
      'clientSecret' : 'OlbENW0n3RlpTLwLCicYgA((',
      'callbackURL'    : 'http://octoblu.com/api/auth/StackOverflow/callback'
    },
    'bitly' : {
      'clientId'       : '1c55f213d790c4b5efc3ab67520d71926daf33fe',
      'clientSecret'    : 'e07a564eca8414628833830ea3c42800f16aef98',
      'callbackURL'    : 'http://octoblu.com/api/auth/Bitly/callback'
    },
    'foursquare' : {
      'clientKey'    : 'TWS4TQMSWG20PQPR45ZAWDBKPKKQR0IFR4YN31KCCVFCM5GP',
      'clientSecret' : 'WBDW3TOO2P4ZRDM1PXGMBXIPKJKZKCNHM0S0BZI3ECF3JJPK',
      'callbackURL'    : 'http://octoblu.com/api/auth/FourSquare/callback'
    },
    'rdio' : {
      'consumerKey'    : '8xrf6qedwvp2m5zmwrrhbb2j',
      'consumerSecret' : 'E5EbEc5vdf',
      'callbackURL'    : 'http://octoblu.com/api/auth/Rdio/callback'
    },
    'lastfm' : {
      'consumerKey'    : 'c034d4839dfa3e855f610145d1ecb819',
      'consumerSecret' : 'd02830cccb806daada107f8a1f1b3777',
      'base_url'       : 'http://www.last.fm/api/auth/',
      'callbackURL'    : 'http://octoblu.com/api/auth/LastFM/callback'
    },
    'delicious' : {
      'consumerKey'    : 'e9e36c5c7ab86dd3a33cccafa2c9afbb',
      'consumerSecret' : 'fc69b39b321995c141ecf4e30207b0a2',
      'base_url'       : 'https://delicious.com/',
      'callbackURL'    : 'http://octoblu.com/api/auth/Delicious/callback'
    },
    'musixmatch' : {
      'base_url'       : 'http://api.musixmatch.com/ws/1.1/',
    },
    'port' : 80,
    'domain': '.octoblu.com'

  }
};

module.exports = function (environment) {
  return config[environment];
};