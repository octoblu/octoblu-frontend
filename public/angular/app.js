// create the module and name it e2eApp
// var e2eApp = angular.module('e2eApp', ['ngRoute']); 
var e2eApp = angular.module('e2eApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate']); 

// configure our routes
// e2eApp.config(function($routeProvider, $locationProvider, $sceDelegateProvider) {  
e2eApp.config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', function($routeProvider, $locationProvider, $sceDelegateProvider) {

  $sceDelegateProvider.resourceUrlWhitelist([
    'self', 
    'http://*:*@red.meshines.com:*/**', 
    'http://*:*@designer.octoblu.com:*/**', 
    'http://skynet.im/**',
    'http://54.203.249.138:8000/**',
    '**'
  ]);

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

    .when('/connector', {
      templateUrl : 'pages/connector.html',
      controller  : 'connectorController'
    }) 

    .when('/designer', {
      templateUrl : 'pages/designer.html',
      controller  : 'designerController'
    }) 

    .when('/analyzer', {
      templateUrl : 'pages/analyzer.html',
      controller  : 'analyzerController'
    }) 

    .when('/controller', {
      templateUrl : 'pages/controller.html',
      controller  : 'controllerController'
    }) 

    .when('/community', {
      templateUrl : 'pages/community.html',
      controller  : 'communityController'
    }) 

    .when('/services', {
      templateUrl : 'pages/services.html',
      controller  : 'servicesController'
    }) 

    .when('/admin', {
      templateUrl : 'pages/admin.html',
      controller  : 'adminController'
    }) 

    .when('/docs', {
      templateUrl : 'pages/docs.html',
      controller  : 'docsController'
    }) 

    .when('/pricing', {
      templateUrl : 'pages/pricing.html',
      controller  : 'pricingController'
    }) 

    .when('/faqs', {
      templateUrl : 'pages/faqs.html',
      controller  : 'faqsController'
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

    // .otherwise({redirectTo: '/'});
    // .otherwise({window.location.href='/'});
    
    $locationProvider
      .html5Mode(true)
      .hashPrefix('!');

// });
}]);

