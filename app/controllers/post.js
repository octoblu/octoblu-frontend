var Post = require('../models/post');

module.exports = function ( app ) {
  // Get all posts
  app.get('/posts', function ( request, response ) {
    query = Post.find();
    query.exec()
      .on('complete', function ( posts ) {
        console.log('There were ' + posts.length + ' posts');
        response.json(posts);
      })
      .on('error', function ( error ) {
        console.error('There was an error: ' + error);
        response.send(error);
      })
      .fulfill();
  });

  // Create a post
  // Edit a post
  // Reply to a post
  // Upload a photo
};
