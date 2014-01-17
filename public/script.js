// create the module and name it e2eApp
// var e2eApp = angular.module('e2eApp', ['ngRoute']); 
var e2eApp = angular.module('e2eApp', ['ngRoute', 'ui.bootstrap']); 


// configure our routes
// e2eApp.config(function($routeProvider, $locationProvider) {
e2eApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  
  $routeProvider

    // define SPA routes
    .when('/', {
      templateUrl : 'pages/home.html',
      controller  : 'mainController'
    })

    .when('/about', {
      templateUrl : 'pages/about.html',
      controller  : 'aboutController'
    })

    .when('/contact', {
      templateUrl : 'pages/contact.html',
      controller  : 'contactController'
    })

    .when('/profile', {
      templateUrl : 'pages/profile.html',
      controller  : 'profileController'
    })

    .when('/dashboard', {
      templateUrl : 'pages/dashboard.html',
      controller  : 'dashboardController'
    }) 

    .when('/signup', {
      templateUrl : 'pages/signup.html',
      controller  : 'signupController'
    })

    .when('/login', {
      templateUrl : 'pages/login.html',
      controller  : 'loginController'
    })
    // .when('/logout', {
    //   $window.location.href = '/logout'
    // })
    .when('/forgot', {
      templateUrl : 'pages/forgot.html',
      controller  : 'forgotController'
    });

    // .otherwise({window.location.href = $location.path()});
    
    $locationProvider
      .html5Mode(true)
      .hashPrefix('!');
// });
}]);


// create the controller and inject Angular's $scope
e2eApp.controller('mainController', function($scope, $location) {
  // create a message to display in our view
  user = {};
  user = $.cookie("e2e");
  if(user != undefined ){
    // window.location.href = "/dashboard";
    $location.path("/dashboard");
  } else {  
    $scope.message = 'Home page content pending.';
  }
});

e2eApp.controller('aboutController', function($scope, $http) {
  $scope.message = 'About page content pending.';
  checkLogin($scope, $http, false);  

});

e2eApp.controller('contactController', function($scope, $http) {
  $scope.message = 'Contact page content pending.';
  checkLogin($scope, $http, false);  

});

e2eApp.controller('loginController', function($scope) {
  $scope.message = 'Login.';
});

e2eApp.controller('profileController', function($scope) {
  $scope.email = 'topher@me.com';
});

e2eApp.controller('dashboardController', function($scope, $http) {
  checkLogin($scope, $http, true);  
});

function checkLogin($scope, $http, secured) {
  user = {};
  user = $.cookie("e2e");
  if(user == undefined){
    if (secured){
      window.location.href = "/login";
    }
      
  } else {

    $http.get('/api/user/' + user)
      .success(function(data) {
        $scope.user_id = data._id;

        $(".auth").hide();
        $(".user-menu").show();
        $(".toggle-nav").show();
        if (data.twitter != undefined) {
          $(".user-name").html('@' + data.twitter.username.toString());
          $scope.user = data.twitter.displayName;
          $scope.skynetuuid = data.twitter.skynetuuid;

        } else if (data.facebook != undefined) {                    
          $(".avatar").html('<img width="23" height="23" alt="' + data.facebook.name.toString() + '" src="https://graph.facebook.com/' + data.facebook.id.toString() + '/picture" />' );
          $(".user-name").html(data.facebook.name.toString());
          $scope.user = data.facebook.name;
          $scope.skynetuuid = data.facebook.skynetuuid;

        } else if (data.google != undefined) {
          $(".avatar").html('<img width="23" height="23" alt="' + data.google.name.toString() + '" src="https://plus.google.com/s2/photos/profile/' + data.google.id.toString() + '?sz=32" />' );
          $(".user-name").html('+' + data.google.name.toString());
          $scope.user = data.google.name;
          $scope.skynetuuid = data.google.skynetuuid;

        } else if (data.local != undefined) {
          $(".user-name").html(data.local.email.toString());
          $scope.user = data.local.email;
          $scope.skynetuuid = data.local.skynetuuid;
        }
        

      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

  }

}
 
