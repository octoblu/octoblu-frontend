'use strict';
//TODO - remove checkLogin function
// create the module and name it octobluApp
angular.module('octobluApp', ['ngAnimate', 'ngSanitize', 'ngCookies', 'ui.bootstrap', 'ui.router', 'ui.utils', 'angular-google-analytics', 'elasticsearch', 'ngResource'])
    .constant('skynetConfig', {
        'host': 'skynet.im',
        'port': '80'
        // 'host': 'localhost', //change to the skynet.im instance
        // 'port': '3000'
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

        $httpProvider.interceptors.push(function ($location) {
            return {
                responseError: function (response) {
                    if (response.status === 401) {
                        $location.url('/login');
                    }
                    return response;
                }
            };
        });

        $stateProvider
            .state('ob', {
                abstract: true,
                controller: 'OctobluController',
                templateUrl: "pages/octoblu.html",
                resolve: {
                    currentUser: function (AuthService) {
                        return AuthService.getCurrentUser();
                    },
                    myDevices: function (deviceService) {
                        return deviceService.getDevices();
                    }
                },
                unsecured: true
            })
            .state('terms', {
                url: '/terms',
                templateUrl: 'pages/terms.html',
                controller: 'termsController',
                unsecured: true
            })
            .state('ob.about', {
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
            .state('ob.profile', {
                url: '/profile',
                templateUrl: 'pages/profile.html',
                controller: 'profileController'
            })
            .state('ob.process', {
                url: '/process',
                templateUrl: 'pages/process.html',
                controller: 'processController'
            })
            .state('ob.connector', {
                url: '/connect',
                templateUrl: 'pages/connector/index.html',
                resolve: {
                    availableDeviceTypes: function (channelService) {
                        return channelService.getDeviceTypes();
                    },
                    myGateways: function (myDevices, deviceService) {
                        var gateways = _.filter(myDevices, {type: 'gateway', online: true });
                        _.map(gateways, function (gateway) {
                            gateway.subdevices = [];
                            gateway.plugins = [];
                            return deviceService.gatewayConfig({
                                "uuid": gateway.uuid,
                                "token": gateway.token,
                                "method": "configurationDetails"
                            }).then(function (response) {
                                if (response && response.result) {
                                    gateway.subdevices = response.result.subdevices || [];
                                    gateway.plugins = response.result.plugins || [];
                                }
                            }, function () {
                                console.log('couldn\'t get data for: ');
                                console.log(gateway);
                            });
                        });
                        return gateways;
                    }
                }
            })
            .state('ob.connector.nodes', {
                url: '/nodes',
                abstract: true,
                template: '<ui-view></ui-view>'
            })
            .state('ob.connector.nodes.all', {
                url: '/',
                controller: 'NodeController',
                templateUrl: 'pages/connector/nodes/index.html'
            })
            .state('ob.connector.nodes.device-detail', {
                url: '/device/:uuid',
                controller: 'DeviceDetailController',
                templateUrl: 'pages/connector/devices/detail/index.html'
            })
            .state('ob.connector.nodes.channel-detail', {
                url: '/channel/:id',
                templateUrl: 'pages/connector/channels/detail.html',
                controller: 'apiController'
            })
            .state('ob.connector.devices.wizard', {
                url: '/wizard',
                abstract: true,
                controller: 'DeviceWizardController',
                templateUrl: 'pages/connector/devices/wizard/index.html',
                resolve: {
                    unclaimedDevices: function (deviceService) {
                        return deviceService.getUnclaimedNodes();
                    }
                }
            })
            .state('ob.connector.devices.wizard.instructions', {
                url: '/instructions?claim',
                templateUrl: 'pages/connector/devices/wizard/hub-install-instructions.html'
            })
            .state('ob.connector.devices.wizard.finddevice', {
                url: '/finddevice?claim',
                templateUrl: 'pages/connector/devices/wizard/find-device.html'
            })
            //begin refactor states
            .state('ob.connector.channels', {
                abstract: true,
                url: '/channels',
                template: '<ui-view />',
                controller: 'ChannelController',
                resolve: {
                    activeChannels: function (channelService) {
                        return channelService.getActiveChannels();

                    },
                    availableChannels: function (channelService) {
                        return channelService.getAvailableChannels();
                    }
                }
            })
            .state('ob.connector.channels.index', {
                url: '',
                templateUrl: 'pages/connector/channels/index.html'
            })

            .state('ob.connector.channels.resources', {
                url: '/resources',
                templateUrl: 'pages/connector/channels/resources/index.html',
                controller: 'apiResourcesController'
            })
            .state('ob.connector.channels.resources.detail', {
                url: '/:id',
                templateUrl: 'pages/connector/channels/resources/detail.html',
                controller: 'apiResourcesController'
            })
            .state('ob.connector.advanced', {
                url: '/advanced',
                templateUrl: 'pages/connector/advanced/index.html'
            })
            .state('ob.connector.advanced.devices', {
                url: '/smartdevices',
                controller: 'smartDeviceController',
                templateUrl: 'pages/connector/advanced/devices.html'
            })
            // .state('ob.connector.advanced.channels', {
            //     url: '/custom_channels',
            //     templateUrl: 'pages/connector/advanced/channels.html'
            // })
            .state('ob.connector.advanced.channels', {
                // abstract: true,
                url: '/custom_channels',
                // template: '<ui-view />',
                templateUrl: 'pages/connector/advanced/channels.html',
                controller: 'CustomChannelController',
                resolve: {
                    customChannels: function (channelService) {
                        return channelService.getCustomList();
                    }
                }
                // resolve: {
                //     customChannels: function (channelService) {
                //         return [];
                //     }
                // }
            })
            // .state('ob.connector.advanced.channels.index', {
            //     url: '',
            //     templateUrl: 'pages/connector/advanced/channels.html'
            // })
            .state('ob.connector.advanced.channels.editor', {
                url: '/editor/:id',
                templateUrl: 'pages/connector/channels/editor.html',
                controller: 'apiEditorController'
            })

            .state('ob.connector.advanced.gateways', {
                url: '/gateways',
                templateUrl: 'pages/connector/advanced/gateways/index.html',
                controller: 'hubController'
            })
            .state('ob.connector.advanced.messaging', {
                url: '/messaging',
                controller: 'MessagingController',
                templateUrl: 'pages/connector/advanced/messaging.html'
            })
            //end refactor states

            .state('ob.admin', {
                abstract: true,
                url: '/admin',
                templateUrl: 'pages/admin/index.html',
                controller: 'adminController',
                resolve: {
                    operatorsGroup: function (GroupService) {
                        return GroupService.getOperatorsGroup();
                    },
                    allDevices: function (deviceService) {
                        return deviceService.getDevices();
                    },
                    allGroupResourcePermissions: function (PermissionsService) {
                        return PermissionsService.allGroupPermissions();
                    }
                }
            })
            .state('ob.admin.all', {
                url: '/groups',
                templateUrl: 'pages/admin/groups/all.html'
            })
            .state('ob.admin.detail', {
                url: '/groups/:uuid',
                templateUrl: 'pages/admin/groups/detail.html',
                controller: 'adminGroupDetailController',
                resolve: {
                    resourcePermission: function (allGroupResourcePermissions, $stateParams) {
                        return _.findWhere(allGroupResourcePermissions, {uuid: $stateParams.uuid});
                    },
                    sourcePermissionsGroup: function (resourcePermission, GroupService) {
                        return GroupService.getGroup(resourcePermission.source.uuid);
                    },
                    targetPermissionsGroup: function (resourcePermission, GroupService) {
                        return GroupService.getGroup(resourcePermission.target.uuid);
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'pages/login.html',
                controller: 'loginController',
                unsecured: true
            })
            .state('forgot', {
                url: '/forgot',
                templateUrl: 'pages/forgot.html',
                controller: 'forgotController',
                unsecured: true
            })
            .state('ob.analyze', {
                url: '/analyze',
                templateUrl: 'pages/analyze.html',
                controller: 'analyzeController'
            })
            .state('ob.community', {
                url: '/community',
                templateUrl: 'pages/community.html'
            })
            .state('ob.design', {
                url: '/design',
                templateUrl: 'pages/design.html',
                controller: 'designController'
            })
            .state('ob.docs', {
                url: '/docs',
                templateUrl: 'pages/docs.html',
                controller: 'docsController'
            })
            .state('ob.faqs', {
                url: '/faqs',
                templateUrl: 'pages/faqs.html',
                controller: 'faqsController'
            })
            .state('ob.home', {
                url: '/home',
                templateUrl: 'pages/home.html',
                controller: 'homeController'
            })
            .state('ob.services', {
                url: '/services',
                templateUrl: 'pages/services.html',
                controller: 'servicesController'
            })
            .state('ob.nodewizard', {
                url: '/node-wizard',
                abstract: true,
                controller: 'nodeWizardController',
                templateUrl: 'pages/node-wizard/index.html'
            })
            .state('ob.nodewizard.addnode', {
                url: '',
                controller: 'addNodeController',
                templateUrl: 'pages/node-wizard/add-node.html'
            })

            .state('ob.nodewizard.addchannel', {
                url: '/node-wizard/add-channel/:nodeTypeId',
                controller: 'addChannelController',
                templateUrl: 'pages/node-wizard/add-channel/index.html',
                abstract: true,
                resolve: {
                    nodeType: function($stateParams, NodeTypeService){
                        return NodeTypeService.getNodeTypeById($stateParams.nodeTypeId);
                    }
                }
            })
            .state('ob.nodewizard.addchannel.existing', {
                url: '',
                controller: 'addChannelExistingController',
                templateUrl: 'pages/node-wizard/add-channel/existing.html'
            })
            .state('ob.nodewizard.addchannel.noauth', {
                url: '/noauth',
                controller: 'addChannelNoauthController',
                templateUrl: 'pages/node-wizard/add-channel/noauth.html'
            })
            .state('ob.nodewizard.addchannel.oauth', {
                url: '/oauth',
                controller: 'addChannelOauthController',
                templateUrl: 'pages/node-wizard/add-channel/oauth.html'
            })
            .state('ob.nodewizard.addchannel.simple', {
                url: '/simple',
                controller: 'addChannelSimpleController',
                templateUrl: 'pages/node-wizard/add-channel/simple.html'
            })

            .state('ob.nodewizard.adddevice', {
                url: '/add-device/:nodeTypeId',
                controller: 'addDeviceController',
                templateUrl: 'pages/node-wizard/add-device/index.html'
            })
            .state('ob.nodewizard.addgateway', {
                url: '/add-gateway/:nodeTypeId',
                controller: 'addDeviceController',
                templateUrl: 'pages/node-wizard/add-device/index.html'
            })
            .state('ob.nodewizard.addsubdevice', {
                url: '/add-subdevice/:nodeTypeId',
                controller: 'addSubdeviceController',
                templateUrl: 'pages/node-wizard/add-subdevice/index.html',
                abstract: true
            })
            .state('ob.nodewizard.addsubdevice.addGateway', {
                url: '/add-gateway',
                controller: 'addSubdeviceAddGatewayController',
                templateUrl: 'pages/node-wizard/add-device/index.html'
            })
            .state('ob.nodewizard.addsubdevice.selectgateway', {
                url: '',
                controller: 'addSubdeviceSelectGatewayController',
                templateUrl: 'pages/node-wizard/add-subdevice/select-gateway.html'
            })
            .state('ob.nodewizard.addsubdevice.form', {
                url: '/gateways/:gatewayId',
                controller: 'addSubdeviceFormController',
                templateUrl: 'pages/node-wizard/add-subdevice/form.html'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'pages/signup.html',
                controller: 'signupController',
                unsecured: true
            })
            .state('reset', {
                url: '/reset/:resetToken',
                templateUrl: 'pages/reset/reset.html',
                controller: 'resetController',
                unsecured: true
            });

        $locationProvider.html5Mode(true);

        // For any unmatched url, redirect to /
        $urlRouterProvider.otherwise('/home');
    })
    .run(function ($rootScope, $window, $state, $urlRouter, $location, AuthService) {

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
            console.log('error from ' + fromState.name + ' to ' + toState.name)
            ;
        });

        $rootScope.$on('$stateChangeStart', function (event, toState) {
            if (!toState.unsecured) {
                return AuthService.getCurrentUser(true).then(null, function (err) {
                    console.log('LOGIN ERROR:');
                    console.log(err);
                    event.preventDefault();
                    $location.url('/login');
                });
            }
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
