'use strict';
//TODO - remove checkLogin function
// create the module and name it octobluApp
angular.module('octobluApp', ['ngAnimate', 'ngSanitize', 'ngCookies', 'ui.bootstrap', 'ui.router', 'ui.utils', 'angular-google-analytics', 'elasticsearch', 'ngResource'])
    .constant('skynetConfig', {
        'host': '127.0.0.1', //change to the skynet.im instance
        'port': '3000'
    })
    // enabled CORS by removing ajax header
    .config(function ($httpProvider, $locationProvider, $stateProvider, $urlRouterProvider, $sceDelegateProvider, AnalyticsProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://*:*@red.meshines.com:*/**',
            'http://*:*@designer.octoblu.com:*/**',
            'http://skynet.im/**',
            'http://54.203.249.138:8000/**',
            '**'
        ]);

        // initial configuration - https://github.com/revolunet/angular-google-analytics
        AnalyticsProvider.setAccount('UA-2483685-30');
        //Optional set domain (Use 'none' for testing on localhost)
        AnalyticsProvider.setDomainName('octoblu.com');
        // Use analytics.js instead of ga.js
        AnalyticsProvider.useAnalytics(true);
        // change page event name
        AnalyticsProvider.setPageEvent('$stateChangeSuccess');

        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'pages/home3.html',
                controller: 'homeController'

            })
            .state('home2', {
                url: '/home2',
                templateUrl: 'pages/home2.html',
                controller: 'homeController'
            })
            .state('home3', {
                url: '/home3',
                templateUrl: 'pages/home3.html',
                controller: 'homeController'
            })
            .state('terms', {
                url: '/terms',
                templateUrl: 'pages/terms.html',
                controller: 'termsController'
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
                template : '<ui-view></ui-view>',
                resolve: {
                    currentUser: function (userService) {
                        return userService.getCurrentUser();
                    },
                    smartDevices: function (channelService) {
                        return channelService.getSmartDevices();
                    },
                    claimedGateways: function (currentUser, ownerService) {
                        return ownerService.getClaimedGateways({skynetuuid: currentUser.skynetuuid, skynettoken: currentUser.skynettoken});
                    }
                },
                onEnter: function () {
//                    console.log('Entering devices state');
                },
                onExit: function () {
//                    console.log('leaving devices state');
                }
            })
            .state('connector.devices.index', {
                url: '/',
                templateUrl: 'pages/connector/devices/index.html',
                controller: 'DeviceController',

                onEnter: function () {
//                    console.log('Entering devices state');
                },
                onExit: function () {
//                    console.log('leaving devices state');
                }
            })
            .state('connector.devices.edit', {
                url: '/edit/:uuid',
                templateUrl: 'pages/connector/devices/edit.html',
                controller: 'DeviceEditController',
                onEnter: function () {
//                    console.log('Entering devices state');
                },
                onExit: function () {
//                    console.log('leaving devices state');
                }
            })
            .state('connector.devices.wizard', {
                url: '/wizard',
                abstract: true,
                templateUrl: 'pages/connector/devices/wizard/index.html',
                controller: 'DeviceWizardController',
                onEnter: function () {
//                    console.log('Entering device wizard state. ');
                },
                onExit: function () {
//                    console.log('Exiting device wizard state. ');
                }

            })
            .state('connector.devices.wizard.instructions', {
                url: '/instructions',
                templateUrl: 'pages/connector/devices/wizard/instructions.html',
                onEnter: function () {
                    //         console.log('Entering device wizard instructions state. ');
                },
                onExit: function () {
                    //           console.log('Exiting device wizard instructions state. ');
                }

            })
            .state('connector.devices.wizard.findhub', {
                url: '/findhub',
                templateUrl: 'pages/connector/devices/wizard/find-hub.html',
                onEnter: function () {

                },
                onExit: function () {

                }
            })
            .state('connector.channels', {
                abstract: true,
                url: '/channels',
                template: '<ui-view />'
            })
            .state('connector.channels.index', {
                url: '',
                templateUrl: 'pages/connector/channels/index.html',
                controller: 'connectorController'
            })
            .state('connector.channels.detail', {
                url: '/:name',
                templateUrl: 'pages/connector/channels/detail.html',
                controller: 'apiController'
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
            .state('connector.advanced.channels.editor', {
                url: '/editor/:name',
                templateUrl: 'pages/connector/channels/editor.html',
                controller: 'apiEditorController'
            })

            .state('connector.advanced.gateways', {
                url: '/gateways',
                templateUrl: 'pages/connector/advanced/gateways.html',
                controller: 'connectorController'
            })
            .state('connector.advanced.messaging', {
                url: '/messaging',
                templateUrl: 'pages/connector/advanced/messaging.html',
                controller: 'controllerController'
            })
            .state('admin', {
                abstract: true,
                url: '/admin',
                templateUrl: 'pages/admin/index.html',
                controller: 'adminController',
                resolve: {
                    operatorsGroup : function(GroupService, currentUser){
                        return GroupService.getOperatorsGroup(currentUser.skynetuuid, currentUser.skynettoken)
                    },
                    currentUser: function (userService) {
                        return userService.getCurrentUser();
                    },
                    allDevices: function (currentUser, GroupService) {
                        return GroupService.getAllDevices(currentUser.skynetuuid, currentUser.skynettoken);
                    },
                    allGroupResourcePermissions: function (currentUser, PermissionsService) {
                        return PermissionsService.allGroupPermissions(currentUser.skynetuuid, currentUser.skynettoken);
                    }
                }
            })
            .state('admin.all', {
                url: '/groups',
                parent: 'admin',
                templateUrl: 'pages/admin/groups/all.html'
            })
            .state('admin.detail', {
                parent: 'admin',
                url: '/groups/:uuid',
                templateUrl: 'pages/admin/groups/detail.html',
                controller: 'adminGroupDetailController',
                resolve: {
                    resourcePermission : function(allGroupResourcePermissions, $stateParams){
                        return _.findWhere(allGroupResourcePermissions, {uuid: $stateParams.uuid});
                    },
                    sourcePermissionsGroup: function (resourcePermission, GroupService, currentUser) {
                        return GroupService.getGroup(currentUser.skynetuuid, currentUser.skynettoken, resourcePermission.source.uuid);
                    },
                    targetPermissionsGroup: function (resourcePermission, GroupService, currentUser) {
                        return GroupService.getGroup(currentUser.skynetuuid, currentUser.skynettoken, resourcePermission.target.uuid);
                    }
                }
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
            .state('designer', {
                url: '/designer',
                templateUrl: 'pages/designer.html',
                controller: 'designerController'
            })
            .state('community', {
                url: '/community',
                templateUrl: 'pages/community.html'
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
//        $urlRouterProvider.otherwise('/');
    })
    .run(function ($rootScope, $state, $stateParams, $cookies, skynetConfig) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // TODO: Replace with proper authorization service object and eliminate checkLogin.
        $rootScope.authorization = { isAuthenticated: false };

        //TODO - remove all calls to checkLogin, create an authorization Service
        $rootScope.checkLogin = function ($scope, $http, $injector, secured, cb) {
            var user = $cookies.skynetuuid;

            if (user == undefined || user == null) {
                if (secured) {
                    window.location.href = "/login";
                }
            } else {
                var userService = $injector.get('userService');
                userService.getUser(user, function (data) {
                    var token;

                    $scope.user_id = data._id;
                    $scope.current_user = data;
                    $rootScope.authorization.isAuthenticated = true;

                    if (data.local) {
                        $(".avatar").html('<img width="23" height="23" src="http://avatars.io/email/' + data.local.email.toString() + '" />');
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
                        $(".avatar").html('<img width="23" height="23" alt="' + data.facebook.name.toString() + '" src="https://graph.facebook.com/' + data.facebook.id.toString() + '/picture" />');
                        $(".user-name").html(data.facebook.name.toString());
                        $scope.user = data.facebook.name;
                        $scope.skynetuuid = data.facebook.skynetuuid;
                        $scope.skynettoken = data.facebook.skynettoken;
                        token = data.facebook.skynettoken;
                    } else if (data.google) {
                        $(".avatar").html('<img width="23" height="23" alt="' + data.google.name.toString() + '" src="https://plus.google.com/s2/photos/profile/' + data.google.id.toString() + '?sz=32" />');
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
                    $scope.ok = function () {
                        $modalInstance.dismiss('ok');
                        if (okFN) {
                            okFN();
                        }
                    };
                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                        if (cancelFN) {
                            cancelFN();
                        }
                    };
                }
            });

            modalInstance.result.then(
                function (response) {
                    if (response === 'ok') {
                        $log.info('clicked ok');
                    }
                },
                function () {
                    $log.info('Modal dismissed at: ' + new Date());
                }
            );

        };

        //They have logged in so create a skynetClient
        if ($cookies.skynetuuid && $cookies.skynettoken) {

            if ($rootScope.skynetClient === undefined) {
                $rootScope.skynetClient = skynet({
                    'host': skynetConfig.host,
                    'port': skynetConfig.port,
                    'uuid': $cookies.skynetuuid,
                    'token': $cookies.skynettoken
                }, function (e, socket) {
                    if (e) {
                        console.log(e.toString());
                    } else {
                        $rootScope.skynetSocket = socket;
                    }
                });
            }
        }
    });
