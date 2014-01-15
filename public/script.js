// create the module and name it e2eApp
var e2eApp = angular.module('e2eApp', ['ngRoute']); 

// configure our routes
e2eApp.config(function($routeProvider, $locationProvider) {
  // $locationProvider.html5Mode(true);
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
    .when('/forgot', {
      templateUrl : 'pages/forgot.html',
      controller  : 'forgotController'
    });
});

// create the controller and inject Angular's $scope
e2eApp.controller('mainController', function($scope) {
  // create a message to display in our view
  user = {};
  user = $.cookie("e2e");
  if(user != undefined ){
    window.location.href = "/#/dashboard";
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
      window.location.href = "/#/login";
    }
      
  } else {

    $http.get('/api/user/' + user)
      .success(function(data) {
        $scope.user_id = data._id;

        $(".auth").hide();
        $(".user-menu").show();
        if (data.twitter != undefined) {
          $(".user-name").html('@' + data.twitter.username.toString());
          $scope.user = data.twitter.displayName;

        } else if (data.facebook != undefined) {
          $(".user-name").html(data.facebook.name.toString());
          $scope.user = data.facebook.name;

        } else if (data.google != undefined) {
          $(".user-name").html('+' + data.google.name.toString());
          $scope.user = data.google.name;

        } else if (data.local != undefined) {
          $(".user-name").html(data.local.email.toString());
          $scope.user = data.local.email;
        }
        

      })
      .error(function(data) {
        console.log('Error: ' + data);
      });

  }

}
 
