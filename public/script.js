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

    .when('/forgot', {
      templateUrl : 'pages/forgot.html',
      controller  : 'forgotController'
    })

    // .otherwise({redirectTo: '/'});
    // .otherwise({window.location.href='/'});

    
    $locationProvider
      .html5Mode(true)
      .hashPrefix('!');
// });
}]);


e2eApp.controller('mainController', function($scope, $location) {
  user = $.cookie("meshines");
  if(user != undefined ){
    window.location.href = "/dashboard";
  } else {  
    $scope.message = 'Home page content pending.';
  }
});

e2eApp.controller('aboutController', function($scope, $http) {
  $scope.message = 'About page content pending.';
  checkLogin($scope, $http, false, function(){});  

});

e2eApp.controller('contactController', function($scope, $http) {
  $scope.message = 'Contact page content pending.';
  checkLogin($scope, $http, false, function(){});  

});

e2eApp.controller('signupController', function($scope, $location) {
});


e2eApp.controller('loginController', function($scope, $http) {
  console.log('login');
  user = $.cookie("meshines");
  console.log(user);
  if (user != undefined){
    window.location.href = "/dashboard";
  }

  // $scope.message = 'Login.';
  
  // window.location.href = "/";
});

e2eApp.controller('profileController', function($scope) {
  $scope.email = 'topher@me.com';
});

e2eApp.controller('dashboardController', function($scope, $http, $location) {
  checkLogin($scope, $http, true, function(){

    // connect to skynet
    var skynetConfig = {
      "uuid": $scope.skynetuuid,
      "token": $scope.skynettoken
    }    
    skynet(skynetConfig, function (e, socket) {
      if (e) throw e

      socket.emit('status', function(data){
        console.log('status received');
        console.log(data);
      });   
      socket.on('message', function(channel, message){
        alert(JSON.stringify(message));
        console.log('message received', channel, message);
      });

    });


  });  


  // curl -X POST -d '{"devices": "5d6e9c91-820e-11e3-a399-f5b85b6b9fd0", "message": {"yellow":"off"}}' http://skynet.im/messages 


});

function checkLogin($scope, $http, secured, cb) {
  user = $.cookie("meshines");
  console.log(user);
  if(user == undefined || user == null){
    if (secured){
      window.location.href = "/login";
    }
      
  } else {

    $http.get('/api/user/' + user)
      .success(function(data) {
        console.log('get user a success');
        console.log(data);
        $scope.user_id = data._id;

        $(".auth").hide();
        $(".user-menu").show();
        $(".toggle-nav").show();
        $(".navbar-brand").attr("href", "/dashboard");

        if (data.local != undefined) {
          $(".user-name").html(data.local.email.toString());
          $scope.user = data.local.email;
          $scope.skynetuuid = data.local.skynetuuid;
          $scope.skynettoken = data.local.skynettoken;

        } else if (data.twitter != undefined) {
          $(".user-name").html('@' + data.twitter.username.toString());
          $scope.user = data.twitter.displayName;
          $scope.skynetuuid = data.twitter.skynetuuid;
          $scope.skynettoken = data.twitter.skynettoken;

        } else if (data.facebook != undefined) {                    
          $(".avatar").html('<img width="23" height="23" alt="' + data.facebook.name.toString() + '" src="https://graph.facebook.com/' + data.facebook.id.toString() + '/picture" />' );
          $(".user-name").html(data.facebook.name.toString());
          $scope.user = data.facebook.name;
          $scope.skynetuuid = data.facebook.skynetuuid;
          $scope.skynettoken = data.facebook.skynettoken;

        } else if (data.google != undefined) {
          $(".avatar").html('<img width="23" height="23" alt="' + data.google.name.toString() + '" src="https://plus.google.com/s2/photos/profile/' + data.google.id.toString() + '?sz=32" />' );
          $(".user-name").html('+' + data.google.name.toString());
          $scope.user = data.google.name;
          $scope.skynetuuid = data.google.skynetuuid;
          $scope.skynettoken = data.google.skynettoken;

        } else {
          // $scope.user = data.local.email;
          $scope.skynetuuid = user;
        }
        // window.location.href = "/dashboard";
        cb();

      })
      .error(function(data) {
        console.log('Error: ' + data);
        // return false;
      });

  }

}
 
