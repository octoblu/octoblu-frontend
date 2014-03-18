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
                controller: 'homeController'
            })
            .state('home2', {
                url: '/home2',
                templateUrl: 'pages/home2.html',
                controller: 'homeController'
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
                templateUrl : 'pages/connector/channels/index.html',
                controller  : 'connectorController'
            })
            .state('connector.channels.detail', {
                url: '/:name',
                templateUrl : 'pages/connector/channels/detail.html',
                controller  : 'apiController'
            })
            .state('connector.channels.editor', {
                url: '/editor/:name',
                templateUrl: 'pages/connector/channels/editor.html',
                controller: 'apiEditorController'
            })
            .state('connector.channels.resources', {
                url: '/resources',
                templateUrl: 'pages/connector/channels/resources/index.html',
                controller: 'apiResourcesController'
            })
            .state('connector.channels.resources.detail', {
                url: '/:apiname',
                templateUrl: 'pages/connector/channels/resources/detail.html',
                controller: 'apiResourcesController'
            })
            .state('connector.advanced', {
                url: '/advanced',
                templateUrl: 'pages/connector/advanced/index.html',
                controller: 'connectorAdvancedController'
            })
            .state('connector.advanced.devices', {
                url: '/smartdevices',
                templateUrl: 'pages/connector/advanced/devices.html',
                controller: 'connectorAdvancedController'
            })
            .state('connector.advanced.channels', {
                url: '/custom_channels',
                templateUrl: 'pages/connector/advanced/channels.html',
                controller: 'connectorAdvancedController'
            })
            .state('connector.advanced.messaging', {
                url: '/messaging',
                templateUrl: 'pages/connector/advanced/messaging.html',
                controller: 'connectorAdvancedController'
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
    .run(function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // TODO: Replace with proper authorization service object and eliminate checkLogin.
        $rootScope.authorization = { isAuthenticated: false };

        $rootScope.checkLogin = function ($scope, $http, $injector, secured, cb) {
            googleAnalytics();

            var user = $.cookie("skynetuuid");

            if (user == undefined || user == null) {
                if (secured) {
                    window.location.href = "/login";
                }
            } else {
                var userService = $injector.get('userService');
                userService.getUser(user, function(data) {
                    var token;

                    $scope.user_id = data._id;
                    $scope.current_user = data
                    $rootScope.authorization.isAuthenticated = true;

                    if (data.local) {
                        $(".avatar").html('<img width="23" height="23" src="http://avatars.io/email/' + data.local.email.toString() + '" />' );
                        $(".user-name").html(data.local.email.toString());
                        $scope.user = data.local.email;
                        $scope.skynetuuid = data.local.skynetuuid;
                        $scope.skynettoken = data.local.skynettoken;
                        token = data.local.skynettoken;
                    } else if (data.twitter) {
                        $(".user-name").html('@' + data.twitter.username.toString());
                        $scope.user = data.twitter.displayName;
                        $scope.skynetuuid = data.twitter.skynetuuid;
                        $scope.skynettoken = data.twitter.skynettoken;
                        token = data.twitter.skynettoken;
                    } else if (data.facebook) {
                        $(".avatar").html('<img width="23" height="23" alt="' + data.facebook.name.toString() + '" src="https://graph.facebook.com/' + data.facebook.id.toString() + '/picture" />' );
                        $(".user-name").html(data.facebook.name.toString());
                        $scope.user = data.facebook.name;
                        $scope.skynetuuid = data.facebook.skynetuuid;
                        $scope.skynettoken = data.facebook.skynettoken;
                        token = data.facebook.skynettoken;
                    } else if (data.google) {
                        $(".avatar").html('<img width="23" height="23" alt="' + data.google.name.toString() + '" src="https://plus.google.com/s2/photos/profile/' + data.google.id.toString() + '?sz=32" />' );
                        $(".user-name").html('+' + data.google.name.toString());
                        $scope.user = data.google.name;
                        $scope.skynetuuid = data.google.skynetuuid;
                        $scope.skynettoken = data.google.skynettoken;
                        token = data.google.skynettoken;
                    } else {
                        // $scope.user = data.local.email;
                        $scope.skynetuuid = user;
                    }

                    cb();
                });
            }

            function googleAnalytics() {
                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

                ga('create', 'UA-2483685-30', 'octoblu.com');
                ga('send', 'pageview');
            }
        };

        $rootScope.confirmModal = function ($modal, $scope, $log, title, message, okFN, cancelFN) {
            var modalHtml = '<div class="modal-header">';
            modalHtml += '<h3>' + title + '</h3>';
            modalHtml += '</div>';
            modalHtml += '<div class="modal-body">';
            modalHtml += message;
            modalHtml += '</div>';
            modalHtml += '<div class="modal-footer">';
            modalHtml += '<button class="btn btn-primary" ng-click="ok()">OK</button>';
            modalHtml += '<button class="btn" ng-click="cancel()">Cancel</button>';
            modalHtml += '</div>';

            var modalInstance = $modal.open({
                template: modalHtml, scope: $scope,
                controller: function ($modalInstance) {
                    $scope.ok = function () { $modalInstance.dismiss('ok'); if(okFN) {okFN();} };
                    $scope.cancel = function () { $modalInstance.dismiss('cancel'); if(cancelFN) {cancelFN();} };
                }
            });

            modalInstance.result.then(
                function (response) { if(response==='ok') { $log.info('clicked ok'); } },
                function () { $log.info('Modal dismissed at: ' + new Date()); }
            );
        };
    });