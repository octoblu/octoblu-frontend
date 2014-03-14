angular.module('e2eApp')
    .controller('communityPostController', function ($scope, $http, $location, $stateParams) {
        checkLogin($scope, $http, false, function(){
            $(".active").removeClass();
            $("#nav-community").addClass('active');
            $("#main-nav").show();
            $("#main-nav-bg").show();
        });

        $scope.slug = $stateParams.slug;
        $scope.post = {};

        $scope.getPost = function () {
            $http.get('/posts/' + $scope.slug)
                .success(function (post) {
                    $scope.post = post;
                })
                .error(function (error) {
                    console.log(error);
                });
        };

        $scope.getPost();
    });
