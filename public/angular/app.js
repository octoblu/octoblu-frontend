'use strict';
//TODO - remove checkLogin function
// create the module and name it octobluApp
angular.module('octobluApp', ['ngAnimate', 'ngSanitize', 'ngCookies', 'ui.ace', 'ui.bootstrap', 'ui.router', 'ui.utils', 'angular-google-analytics', 'elasticsearch', 'ngMaterial', 'ngTable', 'mgo-mousetrap', 'ngClipboard'])
  .config(function ($logProvider) {
    if (window.location.hostname !== 'localhost') {
      $logProvider.debugEnabled(false);
    }
  })
  .config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath('/lib/zeroclipboard/dist/ZeroClipboard.swf');
  }])
  .service('skynetConfig', function ($location) {
    var config = {
      host: 'wss://meshblu.octoblu.com',
      port: '443'
    };

    if ($location.host() === 'staging.octoblu.com') {
      config.host = 'wss://meshblu-staging.octoblu.com';
      config.port = '443';
    }

    if ($location.host() === 'localhost') {
      config.host = 'ws://localhost';
      config.port = '3000';
    }

    return config;
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

    $httpProvider.interceptors.push(function ($window) {
      return {
        responseError: function (response) {
          if (response.status === 401) {
            return $window.location = '/login';
          }
          if (response.status === 403) {
            return $window.location = '/accept_terms';
          }
          return response;
        }
      };
    });

    $stateProvider
      .state('material.design', {
        url: '/design',
        controller: 'DesignerController'
      })
      .state('material', {
        templateUrl: '/pages/material.html',
        controller: 'MaterialController',
        abstract: true
      })
      .state('material.nodewizard', {
        url: '/node-wizard',
        abstract: true,
        controller: 'nodeWizardController',
        templateUrl: '/pages/node-wizard/index.html'
      })
      .state('material.nodewizard.add', {
        url: '/add/:nodeTypeId',
        controller: 'AddNodeWizardController',
        templateUrl: '/pages/node-wizard/add.html'
      })
      .state('material.nodewizard.adddevice', {
        url: '/add-device/:nodeTypeId',
        controller: 'addDeviceController',
        templateUrl: '/pages/node-wizard/add-device/index.html'
      })
      .state('material.nodewizard.addnode', {
        url: '',
        controller: 'addNodeController',
        templateUrl: '/pages/node-wizard/add-node.html'
      })
      .state('material.nodewizard.addchannel', {
        url: '/node-wizard/add-channel/:nodeTypeId',
        controller: 'addChannelController',
        templateUrl: '/pages/node-wizard/add-channel/index.html',
        abstract: true,
        resolve: {
          nodeType: function ($stateParams, NodeTypeService) {
            return NodeTypeService.getNodeTypeById($stateParams.nodeTypeId);
          }
        }
      })
      .state('material.nodewizard.addchannel.default-options', {
        url: '',
        controller: 'addDefaultOptionsController',
        templateUrl: '/pages/node-wizard/add-channel/default-options.html'
      })
      .state('material.nodewizard.addchannel.existing', {
        url: '/existing',
        controller: 'addChannelExistingController',
        templateUrl: '/pages/node-wizard/add-channel/existing.html'
      })
      .state('material.nodewizard.addchannel.noauth', {
        url: '/noauth',
        controller: 'addChannelNoauthController',
        templateUrl: '/pages/node-wizard/add-channel/noauth.html'
      })
      .state('material.nodewizard.addchannel.oauth', {
        url: '/oauth',
        controller: 'addChannelOauthController',
        templateUrl: '/pages/node-wizard/add-channel/oauth.html'
      })
      .state('material.nodewizard.addchannel.simple', {
        url: '/simple',
        controller: 'addChannelSimpleController',
        templateUrl: '/pages/node-wizard/add-channel/simple.html'
      })
      .state('material.nodewizard.addchannel.header', {
        url: '/header',
        controller: 'addChannelHeaderController',
        templateUrl: '/pages/node-wizard/add-channel/simple.html'
      })
      .state('material.nodewizard.addchannel.aws', {
        url: '/aws',
        controller: 'addChannelAWSController',
        templateUrl: '/pages/node-wizard/add-channel/aws.html'
      })
      .state('material.nodewizard.addchannel.clouddotcom', {
        url: '/clouddotcom',
        controller: 'addChannelCloudDotComController',
        templateUrl: '/pages/node-wizard/add-channel/clouddotcom.html'
      })
      .state('material.nodewizard.addchannel.echosign', {
        url: '/echosign',
        controller: 'addChannelEchoSignController',
        templateUrl: '/pages/node-wizard/add-channel/echosign.html'
      })
      .state('material.nodewizard.addchannel.basic', {
        url: '/basic',
        controller: 'addChannelBasicController',
        templateUrl: '/pages/node-wizard/add-channel/basic.html'
      })
      .state('material.nodewizard.addchannel.docusign', {
        url: '/docusign',
        controller: 'addChannelDocuSignController',
        templateUrl: '/pages/node-wizard/add-channel/docusign.html'
      })
      .state('material.nodewizard.addchannel.apikey-basic', {
        url: '/apikey-basic',
        controller: 'addChannelApiKeyBasicController',
        templateUrl: '/pages/node-wizard/add-channel/apikey-basic.html'
      })
      .state('material.nodewizard.addchannel.apikey-dummypass-basic', {
        url: '/apikey-dummypass-basic',
        controller: 'addChannelApiKeyDummyPassBasicController',
        templateUrl: '/pages/node-wizard/add-channel/apikey-basic.html'
      })
      .state('material.nodewizard.addchannel.meshblu', {
        url: '/meshblu',
        controller: 'addChannelMeshbluController',
        templateUrl: '/pages/node-wizard/add-channel/noauth.html'
      })
      .state('material.channel', {
        url: '/channel/:id',
        templateUrl: '/pages/connector/channels/detail.html',
        controller: 'apiController'
      })
      .state('material.nodewizard.addsubdevice', {
        url: '/add-subdevice/:nodeTypeId',
        controller: 'addSubdeviceController',
        templateUrl: '/pages/node-wizard/add-subdevice/index.html',
        abstract: true
      })
      .state('material.nodewizard.addsubdevice.addGateblu', {
        url: '/add-gateblu',
        controller: 'AddSubdeviceAddGatebluController',
        templateUrl: '/pages/node-wizard/add-gateblu/index.html'
      })
      .state('material.nodewizard.addsubdevice.selectgateblu', {
        url: '',
        controller: 'AddSubdeviceSelectGatebluController',
        templateUrl: '/pages/node-wizard/add-subdevice/select-gateblu.html'
      })
      .state('material.nodewizard.addsubdevice.form', {
        url: '/gateblus/:gatebluId',
        controller: 'addSubdeviceFormController',
        templateUrl: '/pages/node-wizard/add-subdevice/form.html'
      })
      .state('material.flow', {
        url: '/design/:flowId',
        templateUrl: '/pages/flow.html',
        controller: 'FlowController'
      })
      .state('material.flow-import', {
        url: '/design/import/:flowTemplateId',
        templateUrl: '/pages/flow-import.html',
        controller: 'FlowImportController'
      })
      .state('material.home', {
        url: '/home',
        templateUrl: '/pages/home.html',
        controller: 'homeController'
      })
      .state('material.nodes', {
        url: '/connect',
        controller: 'NodeController',
        templateUrl: '/pages/connector/nodes/index.html'
      })
      .state('material.device', {
        url: '/device/:uuid',
        controller: 'DeviceDetailController',
        templateUrl: '/pages/connector/devices/detail/index.html',
        resolve: {
          device: function(deviceService, $stateParams){
                return deviceService.getDeviceByUUID($stateParams.uuid);
          }
        }
      })
      .state('material.microblu', {
        url: '/device/:uuid',
        controller: 'DeviceDetailController',
        templateUrl: '/pages/connector/devices/detail/index.html',
        resolve: {
          device: function(deviceService, $stateParams){
                return deviceService.getDeviceByUUID($stateParams.uuid);
          }
        }
      })
      .state('material.templates', {
        url: '/templates',
        templateUrl: '/pages/templates.html',
        controller: 'TemplatesController'
      })
      .state('material.template', {
        url: '/templates/:templateId',
        templateUrl: '/pages/templates.html',
        controller: 'TemplatesController'
      })

      .state('ob', {
        abstract: true,
        controller: 'OctobluController',
        templateUrl: "/pages/octoblu.html",
        resolve: {
          currentUser: function (AuthService) {
            return AuthService.getCurrentUser();
          },
          myDevices: function (NodeService) {
            return NodeService.getNodes({cache: false})
          }
        },
        onEnter: function ($state, currentUser) {
          var terms_accepted_at = new Date(currentUser.terms_accepted_at || null), // new Date(null) -> Epoch
            terms_updated_at = new Date('2014-07-01');

          if (terms_accepted_at < terms_updated_at) {
            $state.go('accept_terms');
          }
        },
        unsecured: true
      })
      .state('accept_terms', {
        url: '/accept_terms',
        templateUrl: '/pages/accept_terms.html',
        controller: 'acceptTermsController',
        resolve: {
          currentUser: function (AuthService) {
            return AuthService.getCurrentUser();
          }
        }
      })
      .state('terms', {
        url: '/terms',
        templateUrl: '/pages/terms.html',
        controller: 'termsController',
        unsecured: true
      })
      .state('ob.about', {
        url: '/about',
        templateUrl: '/pages/about.html',
        controller: 'aboutController',
        unsecured: true
      })
      .state('contact', {
        url: '/contact',
        templateUrl: '/pages/contact.html',
        controller: 'contactController',
        unsecured: true
      })
      .state('ob.profile', {
        url: '/profile',
        templateUrl: '/pages/profile.html',
        controller: 'profileController'
      })
      .state('ob.clearauth', {
        url: '/clearauth',
        templateUrl: '/pages/clear-auth.html',
        controller:  'clearAuthController'
      })
      .state('ob.process', {
        url: '/process',
        templateUrl: '/pages/process.html',
        controller: 'processController'
      })

      .state('ob.admin', {
        abstract: true,
        url: '/admin',
        templateUrl: '/pages/admin/index.html',
        controller: 'AdminController',
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
        templateUrl: '/pages/admin/groups/all.html'
      })
      .state('ob.admin.detail', {
        url: '/groups/:uuid',
        templateUrl: '/pages/admin/groups/detail.html',
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
        templateUrl: '/pages/login.html',
        controller: 'loginController',
        unsecured: true
      })
      .state('forgot', {
        url: '/forgot',
        templateUrl: '/pages/forgot.html',
        controller: 'forgotController',
        unsecured: true
      })
      .state('invitation', {
        url: '/invitation',
        templateUrl : '/pages/invitation/index.html',
        abstract : true,
        unsecured: true
      })
      .state('invitation.accept', {
        url : '/accept',
        templateUrl : '/pages/invitation/accept.html',
        controller: 'InvitationAcceptController',
        unsecured: true
      })
      .state('invitation.request', {
        url : '/request',
        templateUrl : '/pages/invitation/request.html',
        controller: 'InvitationRequestController',
        unsecured: true
      })
      .state('invitation.sent', {
        url : '/sent',
        templateUrl : '/pages/invitation/sent.html',
        unsecured: true
      })

      .state('ob.analyze', {
        url: '/analyze',
        templateUrl: '/pages/analyze.html',
        controller: 'analyzeController'
      })
      .state('ob.faqs', {
        url: '/faqs',
        templateUrl: '/pages/faqs.html',
        controller: 'faqsController'
      })
      .state('ob.services', {
        url: '/services',
        templateUrl: '/pages/services.html',
        controller: 'servicesController'
      })
      .state('ob.nodewizard.addnode', {
        url: '',
        controller: 'addNodeController',
        templateUrl: '/pages/node-wizard/add-node.html'
      })


      .state('ob.nodewizard.addgateblu', {
        url: '/add-gateblu/:nodeTypeId',
        controller: 'addDeviceController',
        templateUrl: '/pages/node-wizard/add-gateblu/index.html'
      })
      .state('ob.nodewizard.addmicroblu', {
        url: '/add-microblu/:nodeTypeId',
        controller: 'addDeviceController',
        templateUrl: '/pages/node-wizard/add-device/index.html'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: '/pages/signup.html',
        controller: 'SignupController',
        unsecured: true
      })
      .state('reset', {
        url: '/reset/:resetToken',
        templateUrl: '/pages/reset/reset.html',
        controller: 'resetController',
        unsecured: true
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise('/home');
  })
  .run(function ($log, $rootScope, $window, $state, $urlRouter, $location, AuthService) {

    // $window.console.log = $log.debug;

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      console.log('error from ' + fromState.name + ' to ' + toState.name, error);
      console.log(error.stack);
    });

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
      // console.log('transition', fromState.name, toState.name);
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
