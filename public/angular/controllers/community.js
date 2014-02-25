e2eApp.controller('communityController', function($scope, $http, $location) {
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#nav-community").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();
  });

  $scope.posts = [];
  
  $scope.getPosts = function () {
    console.log('getting posts ...');
    $http.get('/posts')
      .success(function (posts) {
        $scope.posts = posts;
      })
      .error(function (error) {
        console.log(error);
      });
  };

  $scope.getPosts();
});
