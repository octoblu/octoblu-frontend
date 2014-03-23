//require('../test_helper');
//var mongoose = require('mongoose'),
//    Author = mongoose.model('Author'),
//    Post = mongoose.model('Post');
//
//describe('Post', function () {
//  describe('#save', function () {
//    var post;
//    var author = new Author({firstName: 'Test', lastName: 'User'});
//
//    beforeEach(function () {
//      post = new Post();
//    });
//
//    it('validates presence of a title', function (done) {
//      done();
//      /* Putting in pending until mongoose test issues resolved
//      post.save(function (error, postInstance, numberAffected) {
//        if(error) return done(error);
//        console.log(postInstance);
//        assert(postInstance.errors);
//        assert_equal('is missing', post.errors.title.message);
//        done();
//      });
//      */
//    });
//
//    it('validates presence of content');
//    it('has an id');
//    it('has a timestamp');
//    it('has an author');
//
//    describe('#author', function () {
//      beforeEach(function () {
//        post.save();
//      });
//
//      it('author has a uuid');
//      it('author has a name');
//    });
//  });
//});
