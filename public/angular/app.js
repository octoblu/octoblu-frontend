// create the module and name it e2eApp
var e2eApp = angular.module('e2eApp', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngSanitize']);

    // enabled CORS by removing ajax header
e2eApp.config(function($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })
    .config(function ($httpProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'pages/home.html',
                controller: 'mainController'
            })
            .state('home2', {
                url: '/home2',
                templateUrl: 'pages/home2.html',
                controller: 'mainController'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'pages/about.html',
                controller: 'aboutController'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'pages/contact.html',
                controller: 'contactController'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'pages/profile.html',
                controller: 'profileController'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'pages/dashboard.html',
                controller: 'dashboardController'
            })
            .state('connector', {
                url: '/connector',
                templateUrl: 'pages/connector.html',
                controller: 'connectorController'
            })
            .state('connector.apis', {
                url: '/apis',
                templateUrl : 'pages/connector.html',
                controller  : 'connectorController'
            })
            .state('connector.apis.detail', {
                url: '/apis/:name',
                templateUrl : 'pages/api_detail.html',
                controller  : 'apiController'
            })
            .state('connector.devices', {
                url: '/devices',
                templateUrl: 'pages/connector/devices.html',
                controller: 'DeviceController'
            })
            .state('connector.channels', {
                url: '/channels',
                templateUrl: 'pages/connector/channels.html',
                controller: 'ChannelController'
            })
            .state('connector.channels.detail', {
                url: '/:name',
                templateUrl: 'pages/connector/channels_detail.html',
                controller: 'ChannelController'
            })
            .state('connector.tools', {
                url: '/tools',
                templateUrl: 'pages/connector/tools.html',
                controller: 'ToolController'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'pages/admin.html',
                controller: 'adminController'
            })
            .state('analyzer', {
                url: '/analyzer',
                templateUrl: 'pages/analyzer.html',
                controller: 'AnalyzerController'
            })
            .state('docs', {
                url: '/docs',
                templateUrl: 'pages/docs.html',
                controller: 'docsController'
            })
            .state('apieditor', {
                url: '/apieditor/:name',
                templateUrl: 'pages/api_editor.html',
                controller: 'apieditorController'
            })
            .state('apieditor.resources', {
                url: '/resources',
                templateUrl: 'pages/api_resources.html',
                controller: 'apiresourcesController'
            })
            .state('apieditor.resources.detail', {
                url: '/:apiname',
                templateUrl: 'pages/api_resource_details.html',
                controller: 'apiresourcesController'
            })
            .state('controller', {
                url: '/controller',
                templateUrl: 'pages/controller.html',
                controller: 'controllerController'
            })
            .state('designer', {
                url: '/designer',
                templateUrl: 'pages/designer.html',
                controller: 'designerController'
            })
            .state('community', {
                url: '/community',
                templateUrl : 'pages/community.html',
                controller  : 'communityController'
            })
            .state('community.posts', {
                url: '/community/posts/:slug',
                templateUrl : 'pages/community-post.html',
                controller  : 'communityPostController'
            })
            .state('services', {
                url: '/services',
                templateUrl: 'pages/services.html',
                controller: 'servicesController'
            })
            .state('pricing', {
                url: '/pricing',
                templateUrl: 'pages/pricing.html',
                controller: 'pricingController'
            })
            .state('faqs', {
                url: '/faqs',
                templateUrl: 'pages/faqs.html',
                controller: 'faqsController'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'pages/login.html',
                controller: 'loginController'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'pages/signup.html',
                controller: 'signupController'
            })
            .state('forgot', {
                url: '/forgot',
                templateUrl: 'pages/forgot.html',
                controller: 'forgotController'
            });

        $locationProvider.html5Mode(true);

        // For any unmatched url, redirect to /
        $urlRouterProvider.otherwise("/");
    })
    // configure our routes
    .config(function($locationProvider, $sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://*:*@red.meshines.com:*/**',
            'http://*:*@designer.octoblu.com:*/**',
            'http://skynet.im/**',
            'http://54.203.249.138:8000/**',
            '**'
        ]);
//
//        $routeProvider
//            // define SPA routes
//            .when('/', {
//              templateUrl : 'pages/home.html',
//              controller  : 'mainController'
//            })
//            .when('/home2', {
//              templateUrl : 'pages/home2.html',
//              controller  : 'mainController'
//            })
//
//            .when('/about', {
//              templateUrl : 'pages/about.html',
//              controller  : 'aboutController'
//            })
//
//            .when('/contact', {
//              templateUrl : 'pages/contact.html',
//              controller  : 'contactController'
//            })
//
//            .when('/profile', {
//              templateUrl : 'pages/profile.html',
//              controller  : 'profileController'
//            })
//
//            .when('/dashboard', {
//              templateUrl : 'pages/dashboard.html',
//              controller  : 'dashboardController'
//            })
//
//            .when('/connector', {
//              templateUrl : 'pages/connector.html',
//              controller  : 'connectorController'
//            })
//
//            .when('/devices', {
//              templateUrl : 'pages/connector.html',
//              controller  : 'connectorController'
//            })
//
//            .when('/gateways', {
//              templateUrl : 'pages/connector.html',
//              controller  : 'connectorController'
//            })
//
//            .when('/gateway', {
//              templateUrl : 'pages/gateway.html',
//              controller  : 'gatewayController'
//            })
//
//            .when('/apis/:name', {
//              templateUrl : 'pages/api_detail.html',
//              controller  : 'apiController'
//            })
//
//            .when('/apis', {
//              templateUrl : 'pages/connector.html',
//              controller  : 'connectorController'
//            })
//
//            .when('/apieditor/:name', {
//              templateUrl : 'pages/api_editor.html',
//              controller  : 'apieditorController'
//            })
//
//            .when('/apieditor/:name/resources', {
//              templateUrl : 'pages/api_resources.html',
//              controller  : 'apiresourcesController'
//            })
//
//            .when('/apieditor/:name/resources/:apiname', {
//              templateUrl : 'pages/api_resource_details.html',
//              controller  : 'apiresourcedetailController'
//            })
//
//            .when('/tools', {
//              templateUrl : 'pages/connector.html',
//              controller  : 'connectorController'
//            })
//
//            .when('/people', {
//              templateUrl : 'pages/connector.html',
//              controller  : 'connectorController'
//            })
//
//            .when('/designer', {
//              templateUrl : 'pages/designer.html',
//              controller  : 'designerController'
//            })
//
//            .when('/analyzer', {
//              templateUrl : 'pages/analyzer.html',
//              controller  : 'analyzerController'
//            })
//
//            .when('/controller', {
//              templateUrl : 'pages/controller.html',
//              controller  : 'controllerController'
//            })
//
//            .when('/community', {
//              templateUrl : 'pages/community.html',
//              controller  : 'communityController'
//            })
//
//            .when('/community/posts/:slug', {
//              templateUrl : 'pages/community-post.html',
//              controller  : 'communityPostController'
//            })
//
//            .when('/services', {
//              templateUrl : 'pages/services.html',
//              controller  : 'servicesController'
//            })
//
//            .when('/admin', {
//              templateUrl : 'pages/admin.html',
//              controller  : 'adminController'
//            })
//
//            .when('/docs', {
//              templateUrl : 'pages/docs.html',
//              controller  : 'docsController'
//            })
//
//            .when('/pricing', {
//              templateUrl : 'pages/pricing.html',
//              controller  : 'pricingController'
//            })
//
//            .when('/faqs', {
//              templateUrl : 'pages/faqs.html',
//              controller  : 'faqsController'
//            })
//
//            .when('/signup', {
//              templateUrl : 'pages/signup.html',
//              controller  : 'signupController'
//            })
//
//            .when('/login', {
//              templateUrl : 'pages/login.html',
//              controller  : 'loginController'
//            })
//
//            .when('/forgot', {
//              templateUrl : 'pages/forgot.html',
//              controller  : 'forgotController'
//            });

        // .otherwise({redirectTo: '/'});
        // .otherwise({window.location.href='/'});
//
//        $locationProvider
//          .html5Mode(true)
//          .hashPrefix('!');
//
//        // });
    });
