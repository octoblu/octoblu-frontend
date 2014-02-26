e2eApp.controller('communityPostController', function ($scope, $params, $http, $location) {
  checkLogin($scope, $http, false, function(){
    $(".active").removeClass();
    $("#nav-community").addClass('active');
    $("#main-nav").show();
    $("#main-nav-bg").show();
  });

  $scope.slug = $params.slug;
  $scope.post = {};

  $scope.getPost = function () {
    $http.get('/posts/' + $scope.slug, function (error, post) {
      if(error) {
        console.log(error);
      } else {
        $scope.post = post;
      }
    });
  };

  $scope.getPost();
});
