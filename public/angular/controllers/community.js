e2eApp.controller('communityController', function($scope, $http, $location) {
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#nav-community").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();
  });

  $scope.post  = {};
  $scope.posts = [];
  
  $scope.postUrl = function (post) {
    return ('/community/posts/' + post.slug);
  };

  $scope.showPost = function (post) {
    $location.path($scope.postUrl(post));
  };

  $scope.getPosts = function () {
    $http.get('/posts')
      .success(function (posts) {
        $scope.posts = posts;
      })
      .error(function (error) {
        console.log(error);
      });
  };

  $scope.newPost = function () {
    $('#new-post-form').modal();
  };

  $scope.createPost = function () {
    $http.post('/posts', $scope.post)
      .success(function (post) {
        $scope.posts.push(post);
        $scope.clearPostForm();
        $('#new-post-form').modal('hide');
      })
      .error(function (error) {
        console.log(error);
      });
  };

  $scope.clearPostForm = function () {
    $scope.creatingPost = false;
    $scope.post = {};
  };

  $scope.getPosts();
});
