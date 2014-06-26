'use strict';
//TODO - remove checkLogin function
// create the module and name it octobluApp
angular.module('octobluApp', ['ngAnimate', 'ngSanitize', 'ngCookies', 'ui.bootstrap', 'ui.router', 'ui.utils', 'angular-google-analytics', 'elasticsearch', 'ngResource'])
    .constant('skynetConfig', {
        'host': 'localhost', //change to the skynet.im instance
        'port': '3000'
    })
    .constant('reservedProperties', ['$$hashKey', '_id'])
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
                onEnter: function($state){
                    $state.go('dashboard');
                },
                unsecured: true
            })
            .state('terms', {
                url: '/terms',
                templateUrl: 'pages/terms.html',
                controller: 'termsController',
                unsecured: true
            })
            .state('about', {
                url: '/about',
                templateUrl: 'pages/about.html',
                controller: 'aboutController',
                unsecured: true
            })
            .state('contact', {
                url: '/contact',
                templateUrl: 'pages/contact.html',
                controller: 'contactController',
                unsecured: true
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'pages/profile.html',
                controller: 'profileController'
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'pages/dashboard.html',
                controller: 'dashboardController',
                resolve: {
                    currentUser: function (AuthService) {
                        return AuthService.getCurrentUser();
                    },
                    myDevices: function (currentUser, deviceService) {
                        return deviceService.getDevices(currentUser.skynetuuid, currentUser.skynettoken);
                    }
                }
            })
            .state('connector', {
                url: '/connector',
                templateUrl: 'pages/connector/index.html',
                resolve: {
                    currentUser: function (userService) {
                        return userService.getCurrentUser();
                    },
                    availableDeviceTypes: function (channelService) {
                        return channelService.getSmartDevices();
                    },
                    myDevices: function (currentUser, deviceService) {
                        return deviceService.getDevices(currentUser.skynetuuid, currentUser.skynettoken);
                    },
                    myGateways: function (myDevices, skynetService, $q) {
                        var gateways = _.filter(myDevices, {type: 'gateway', online: true });
                        $q.all(_.map(gateways, function (gateway) {
                                return skynetService.gatewayConfig({
                                    "uuid": gateway.uuid,
                                    "token": gateway.token,
                                    "method": "configurationDetails"
                                }).then(function (response) {
                                    gateway.subdevices = response.result.subdevices || [];
                                    gateway.plugins = response.result.plugins || [];
                                }, function () {
                                    console.log('couldn\'t get data for: ');
                                    console.log(gateway);
                                });
                            })
                        );
                        return gateways;
                    }
                }
            })
            .state('connector.devices', {
                url: '/devices',
                abstract: true,
                template: '<ui-view></ui-view>'
            })
            .state('connector.devices.all', {
                url: '',
                controller: 'DeviceController',
                templateUrl: 'pages/connector/devices/index.html'
            })
            .state('connector.devices.detail', {
                url: '/:uuid',
                controller: 'DeviceDetailController',
                templateUrl: 'pages/connector/devices/detail/index.html'
            })
            .state('connector.devices.wizard', {
                url: '/wizard',
                abstract: true,
                controller: 'DeviceWizardController',
                templateUrl: 'pages/connector/devices/wizard/index.html',
                resolve: {
                    unclaimedDevices: function (currentUser, deviceService) {
                        return deviceService.getUnclaimedDevices(currentUser.skynetuuid, currentUser.skynettoken);
                    }
                }
            })
            .state('connector.devices.wizard.instructions', {
                url: '/instructions',
                templateUrl: 'pages/connector/devices/wizard/instructions.html'
            })
            .state('connector.devices.wizard.findhub', {
                url: '/findhub',
                templateUrl: 'pages/connector/devices/wizard/find-hub.html'
            })
            //begin refactor states
            .state('connector.channels', {
                abstract: true,
                url: '/channels',
                template: '<ui-view />',
                controller: 'ChannelController',
                resolve: {
                    activeChannels: function (currentUser, channelService) {
                        return channelService.getActiveChannels(currentUser.skynetuuid);

                    },
                    availableChannels: function (currentUser, channelService) {
                        return channelService.getAvailableChannels(currentUser.skynetuuid);
                    }
                }
            })
            .state('connector.channels.index', {
                url: '',
                templateUrl: 'pages/connector/channels/index.html'
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
                templateUrl: 'pages/connector/advanced/index.html'
            })
            .state('connector.advanced.devices', {
                url: '/smartdevices',
                controller: 'smartDeviceController',
                templateUrl: 'pages/connector/advanced/devices.html'
            })
            .state('connector.advanced.channels', {
                url: '/custom_channels',
                templateUrl: 'pages/connector/advanced/channels.html'
            })
            .state('connector.advanced.channels.editor', {
                url: '/editor/:name',
                templateUrl: 'pages/connector/channels/editor.html',
                controller: 'apiEditorController'
            })

            .state('connector.advanced.gateways', {
                url: '/gateways',
                templateUrl: 'pages/connector/advanced/gateways/index.html',
                controller: 'hubController'
            })
            .state('connector.advanced.messaging', {
                url: '/messaging',
                controller: 'MessagingController',
                templateUrl: 'pages/connector/advanced/messaging.html'
            })
            //end refactor states

            .state('admin', {
                abstract: true,
                url: '/admin',
                templateUrl: 'pages/admin/index.html',
                controller: 'adminController',
                resolve: {
                    operatorsGroup: function (GroupService, currentUser) {
                        return GroupService.getOperatorsGroup(currentUser.skynetuuid, currentUser.skynettoken)
                    },
                    currentUser: function (userService) {
                        return userService.getCurrentUser();
                    },
                    allDevices: function (currentUser, deviceService) {
                        return deviceService.getDevices(currentUser.skynetuuid, currentUser.skynettoken);
                    },
                    allGroupResourcePermissions: function (currentUser, PermissionsService) {
                        return PermissionsService.allGroupPermissions(currentUser.skynetuuid, currentUser.skynettoken);
                    }
                }
            })
            .state('admin.all', {
                url: '/groups',
                templateUrl: 'pages/admin/groups/all.html'
            })
            .state('admin.detail', {
                url: '/groups/:uuid',
                templateUrl: 'pages/admin/groups/detail.html',
                controller: 'adminGroupDetailController',
                resolve: {
                    resourcePermission: function (allGroupResourcePermissions, $stateParams) {
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
                controller: 'analyzerController',
                resolve: {
                    currentUser: function (AuthService) {
                        return AuthService.getCurrentUser();
                    },
                    myDevices: function (currentUser, deviceService) {
                        return deviceService.getDevices(currentUser.skynetuuid, currentUser.skynettoken);
                    }
                }
            })
            .state('docs', {
                url: '/docs',
                templateUrl: 'pages/docs.html',
                controller: 'docsController',
                unsecured: true
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
                controller: 'pricingController',
                unsecured: true
            })
            .state('faqs', {
                url: '/faqs',
                templateUrl: 'pages/faqs.html',
                controller: 'faqsController',
                unsecured: true
            })
            .state('login', {
                url: '/login',
                templateUrl: 'pages/login.html',
                controller: 'loginController',
                unsecured: true
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'pages/signup.html',
                controller: 'signupController',
                unsecured: true
            })
            .state('forgot', {
                url: '/forgot',
                templateUrl: 'pages/forgot.html',
                controller: 'forgotController',
                unsecured: true
            });

        $locationProvider.html5Mode(true);

        // For any unmatched url, redirect to /
//        $urlRouterProvider.otherwise('/');
    })
    .run(function ($rootScope, $state, $urlRouter, AuthService) {
        $rootScope.$on('$stateChangeStart', function (event, toState) {
            if (!toState.unsecured) {
                return AuthService.getCurrentUser().then(function (user) {
                    console.log('got a user!');
                    console.log(user);
                }, function (err) {
                    event.preventDefault();
                    $state.go('login');
                });
            }
        });

        //Just in case we want a user object in an unauthenticated state, we have to do this separately.
        AuthService.getCurrentUser().then(function(user){
            $rootScope.currentUser = user;
        });

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
    });
