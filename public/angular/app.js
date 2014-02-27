// create the module and name it e2eApp
// var e2eApp = angular.module('e2eApp', ['ngRoute']); 
var e2eApp = angular.module('e2eApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate']); 

// enabled CORS by removing ajax header
e2eApp.config(['$httpProvider', function($httpProvider) {

    delete $httpProvider.defaults.headers.common['X-Requested-With'];

}]);

// configure our routes
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

    .when('/devices', {
      templateUrl : 'pages/connector.html',
      controller  : 'connectorController'
    }) 

    .when('/gateways', {
      templateUrl : 'pages/connector.html',
      controller  : 'connectorController'
    }) 

    .when('/gateway', {
      templateUrl : 'pages/gateway.html',
      controller  : 'gatewayController'
    }) 

    .when('/apis/:name', {
      templateUrl : 'pages/api_detail.html',
      controller  : 'apiController'
    })

    .when('/apis', {
      templateUrl : 'pages/connector.html',
      controller  : 'connectorController'
    })

    .when('/apieditor/:name', {
      templateUrl : 'pages/api_editor.html',
      controller  : 'apieditorController'
    }) 

    .when('/apieditor/:name/resources', {
      templateUrl : 'pages/api_resources.html',
      controller  : 'apiresourcesController'
    })

    .when('/apieditor/:name/resources/:apiname', {
      templateUrl : 'pages/api_resource_details.html',
      controller  : 'apiresourcedetailController'
    })

    .when('/tools', {
      templateUrl : 'pages/connector.html',
      controller  : 'connectorController'
    }) 

    .when('/people', {
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

    .when('/community/posts/:slug', {
      templateUrl : 'pages/community-post.html',
      controller  : 'communityPostController'
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

