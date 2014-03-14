angular.module('e2eApp')
    .controller('communityController', function($scope, $http, $location) {
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
            console.log($scope.current_user);

            if ($scope.current_user.local) {
                $scope.post.author = {
                    user_id: $scope.current_user.local.skynetuuid,
                    user_name: $scope.current_user.local.email,
                    user_avatar: 'http://avatars.io/email/' + $scope.current_user.local.email.toString()
                };

            } else if ($scope.current_user.twitter) {
                $scope.post.author = {
                    user_id: $scope.current_user.twitter.skynetuuid,
                    user_name: $scope.current_user.twitter.username,
                    user_avatar: ''
                };

            } else if ($scope.current_user.facebook) {
                $scope.post.author = {
                    user_id: $scope.current_user.facebook.skynetuuid,
                    user_name: $scope.current_user.facebook.name,
                    user_avatar: 'https://graph.facebook.com/' + $scope.current_user.facebook.id.toString() + '/picture'
                };

            } else if ($scope.current_user.google) {
                $scope.post.author = {
                    user_id: $scope.current_user.google.skynetuuid,
                    user_name: $scope.current_user.google.name,
                    user_avatar: 'https://plus.google.com/s2/photos/profile/' + $scope.current_user.google.id.toString() + '?sz=32'
                };
            }

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
