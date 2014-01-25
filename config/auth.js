// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

  // // DEVELOPMENT
  // 'facebookAuth' : {
  //   'clientID'    : '244672615710168', // your App ID
  //   'clientSecret'  : '936b46491b2f10ac4f9941329d68b3bb', // your App Secret
  //   'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
  // },

  // 'twitterAuth' : {
  //   'consumerKey'     : '2GFvhpzG7PzDAiommSLIg',
  //   'consumerSecret'  : 'PMftByICxSfbvf7rPqfivAocDE25a0EqZGDkMbKh6Q',
  //   'callbackURL'     : 'http://localhost:8080/auth/twitter/callback'
  // },

  // 'googleAuth' : {
  //   'clientID'    : '541650856544-9rka38kfvik59jb6j3denspgjn202lcv.apps.googleusercontent.com',
  //   'clientSecret'  : 'VE5h4f7DAh4Z5jQgscPFVIZk',
  //   'callbackURL'   : 'http://localhost:8080/auth/google/callback'
  // },
  // 'port' : 8080


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

  'googleAuth' : {
    'clientID'    : '541059729530-bbt3n8qh5s8c8m5dm7dh6gojiqqrfrbg.apps.googleusercontent.com',
    'clientSecret'  : 'SVTqhJ7RtsK6zqRcKUZrjxM6',
    'callbackURL'   : 'http://octoblu.com/auth/google/callback'
  },
  'port' : 80

};