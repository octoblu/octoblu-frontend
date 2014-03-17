'use strict';

// create the module and name it e2eApp
angular.module('e2eApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.router'])
    // enabled CORS by removing ajax header
    .config(function ($httpProvider, $locationProvider, $stateProvider, $urlRouterProvider, $sceDelegateProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://*:*@red.meshines.com:*/**',
            'http://*:*@designer.octoblu.com:*/**',
            'http://skynet.im/**',
            'http://54.203.249.138:8000/**',
            '**'
        ]);

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
                templateUrl: 'pages/connector/index.html',
                controller: 'connectorController'
            })
            .state('connector.devices', {
                url: '/devices',
                templateUrl: 'pages/connector/devices/index.html',
                controller: 'connectorController'
            })
            .state('connector.channels', {
                abstract: true,
                url: '/channels',
                template: '<ui-view />'
            })
            .state('connector.channels.index', {
                url: '',
                templateUrl : 'pages/channels/index.html',
                controller  : 'connectorController'
            })
            .state('connector.channels.detail', {
                url: '/:name',
                templateUrl : 'pages/channels/detail.html',
                controller  : 'apiController'
            })
            .state('connector.channels.editor', {
                url: '/editor/:name',
                templateUrl: 'pages/channels/editor.html',
                controller: 'apieditorController'
            })
            .state('connector.channels.resources', {
                url: '/resources',
                templateUrl: 'pages/channels/resources/index.html',
                controller: 'apiresourcesController'
            })
            .state('connector.channels.resources.detail', {
                url: '/:apiname',
                templateUrl: 'pages/channels/resources/detail.html',
                controller: 'apiresourcesController'
            })
            .state('connector.advanced', {
                abstract: true,
                url: '/advanced',
                template: '<ui-view />'
            })
            .state('connector.advanced.index', {
                url: '',
                templateUrl: 'pages/channels/advanced/index.html',
                controller: 'connectorAdvancedController'
            })
            .state('connector.advanced.devices', {
                url: '/smartdevices',
                templateUrl: 'pages/channels/advanced/devices.html',
                controller: 'connectorAdvancedController'
            })
            .state('connector.advanced.channels', {
                url: '/custom_channels',
                templateUrl: 'pages/channels/advanced/channels.html',
                controller: 'connectorAdvancedController'
            })
            .state('connector.advanced.messaging', {
                url: '/messaging',
                templateUrl: 'pages/channels/advanced/messaging.html',
                controller: 'controllerAdvancedController'
            })
//            .state('connector.people', {
//                url: '/people',
//                templateUrl: 'pages/people.html',
//                controller: 'connectorController'
//            })
//            .state('connector.channels', {
//                url: '/channels',
//                templateUrl: 'pages/channels.html',
//                controller: 'ChannelController'
//            })
//            .state('connector.channels.detail', {
//                url: '/:name',
//                templateUrl: 'pages/connector/channels_detail.html',
//                controller: 'ChannelController'
//            })
//            .state('connector.gateway', {
//                url: '/gateway',
//                templateUrl: 'pages/gateways.html',
//                controller: 'connectorController'
//            })
//            .state('connector.tools', {
//                url: '/tools',
//                templateUrl: 'pages/devtools.html',
//                controller: 'connectorController'
//            })
            .state('admin', {
                url: '/admin',
                templateUrl: 'pages/admin.html',
                controller: 'adminController'
            })
            .state('analyzer', {
                url: '/analyzer',
                templateUrl: 'pages/analyzer.html',
                controller: 'analyzerController'
            })
            .state('docs', {
                url: '/docs',
                templateUrl: 'pages/docs.html',
                controller: 'docsController'
            })
//            .state('controller', {
//                url: '/controller',
//                templateUrl: 'pages/controller.html',
//                controller: 'controllerController'
//            })
            .state('designer', {
                url: '/designer',
                templateUrl: 'pages/designer.html',
                controller: 'designerController'
            })
            .state('community', {
                url: '/community',
                templateUrl : 'pages/community.html'
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
        $urlRouterProvider.otherwise('/');
    })
    .run(function ($rootScope) {
        //$rootScope.state = $state;
    });
