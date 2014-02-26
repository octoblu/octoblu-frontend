var Post = require('../models/post');

module.exports = function ( app ) {
  app.get('/posts', function ( request, response ) {
    Post.find(function( error, posts ) {
      if(error) {
        console.error(error);
        response.send(error);
      } else {
        response.json(posts);
      }
    });
  });

  app.post('/posts', function ( request, response ) {
    Post.create(request.body, function ( error, post ) {
      if(error) {
        console.error(error);
        response.json({message: error});
      } else {
        response.json(post);
      }
    });
  });

  app.get('/posts/:slug', function ( request, response ) {
    Post.find({slug: request.params.slug}, function ( error, post ) {
      if(error) {
        console.error(error);
        response.json({message: error});
      } else {
        response.json(post);
      }
    });
  });

  // Edit a post
  // Reply to a post
  // Upload a photo
};
