'use strict';
//TODO - remove checkLogin function
// create the module and name it octobluApp
angular.module('octobluApp', ['ngSanitize', 'ngCookies', 'ui.ace', 'ui.bootstrap', 'ui.router', 'ui.utils', 'angular-google-analytics', 'elasticsearch', 'ngMaterial', 'ngTable', 'mgo-mousetrap', 'ngClipboard', 'hc.marked', 'ngAnimate', 'ngIntercom', 'chart.js', 'angulartics', 'schemaForm', 'angulartics.google.analytics', 'ng-autofocus', 'draganddrop'])
  .config(function ($logProvider) {
    if (window.location.hostname !== 'localhost') {
      $logProvider.debugEnabled(false);
    }
  })
  .config(function($mdThemingProvider) {
    $mdThemingProvider.definePalette('octo-blue', {
      '50': '82bbed',
      '100': '5ea8e8',
      '200': '3b94e3',
      '300': '1f81d6',
      '400': '196bb3',
      '500': '14568f',
      '600': '124b7d',
      '700': '0f406b',
      '800': '0d3659',
      '900': '0a2b47',
      'A100': '6c9aff',
      'A200': '3374ff',
      'A400': '0a58ff',
      'A700': '0047e0',
      'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                          // on this palette should be dark or light
      'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
       '200', '300', '400', 'A100'],
      'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();

    $mdThemingProvider.theme('default')
      .primaryPalette('octo-blue')
      .accentPalette('green', {
        'default': '500' // use shade 200 for default, and keep all other shades the same
      });
  })
  .config(['markedProvider', function(marked) {
    marked.setOptions({gfm: true, breaks: true});
  }])
  .config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath('/lib/zeroclipboard/dist/ZeroClipboard.swf');
  }])
  .constant('INTERCOM_APPID', 'ux5bbkjz')

  // Configure your $intercom module with appID
  .config(function($intercomProvider, INTERCOM_APPID) {
    // Either include your app_id here or later on boot
    if (window.location.hostname === 'app.octoblu.com'){
      $intercomProvider
        .appID(INTERCOM_APPID);
    } else {
      $intercomProvider.appID('thuyk9s6');
    }

    // you can include the Intercom's script yourself or use the built in async loading feature
    $intercomProvider
      .asyncLoading(true)
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

    $httpProvider.interceptors.push(function ($window,$location) {
      return {
        responseError: function (response) {
          if (response.status === 401) {
            if($window.location.pathname !== '/login') {
              return $window.location = '/login?callbackUrl=' + $location.url();
            }
          }
          if (response.status === 403) {
            return $window.location = '/profile/new?callbackUrl=' + $location.url();
          }
          if (response.status === 502) {
            if($window.location.pathname !== '/error') {
              return $window.location = '/error';
            }
          }
          return response;
        }
      };
    });

    $stateProvider
      .state('material', {
        templateUrl: '/pages/material.html',
        controller: 'MaterialController',
        abstract: true
      })
      .state('material.root', {
        url: '/',
        templateUrl: '/pages/root.html',
        controller: 'RootController'
      })
      .state('material.error', {
        url: '/error',
        templateUrl: '/pages/error.html',
        controller: 'ErrorController',
        controllerAs: 'controller',
      })
      .state('material.analyze', {
        url: '/analyze',
        templateUrl: '/pages/analyze.html',
        controller: 'AnalyzeController',
        resolve: {
          myDevices: function (NodeService) {
            return NodeService.getNodes({cache: false})
          }
        }
      })
      .state('material.schemaeditortest', {
        url: '/schema-editor-test',
        templateUrl: '/pages/schema-editor-test.html',
        controller: 'SchemaEditorTestController',
        controllerAs: 'controller'
      })
      .state('material.clearauth', {
        url: '/clearauth',
        templateUrl: '/pages/clear-auth.html',
        controller:  'clearAuthController'
      })
      .state('material.design', {
        url: '/design',
        controller: 'DesignerController'
      })
      .state('material.configure', {
        url: '/configure',
        controller: 'ConfigureController',
        templateUrl: '/pages/configure.html'
      })
      .state('material.nodewizard', {
        url: '/node-wizard',
        abstract: true,
        controller: 'nodeWizardController',
        templateUrl: '/pages/node-wizard/index.html'
      })
      .state('material.nodewizard.addnode', {
        url: '',
        controller: 'addNodeController',
        templateUrl: '/pages/node-wizard/add-node.html'
      })
      .state('material.nodewizard.add', {
        url: '/add/:nodeTypeId',
        controller: 'AddNodeWizardController',
        templateUrl: '/pages/node-wizard/add.html'
      })
      .state('material.nodewizard.claim', {
        url: '/claim/:uuid/:token',
        controller: 'ClaimNodeController',
        controllerAs: 'controller',
        templateUrl: '/pages/node-wizard/claim.html'
      })
      .state('material.nodewizard.manualclaim', {
        url: '/claim',
        controller: 'ManualClaimNodeController',
        controllerAs: 'controller',
        templateUrl: '/pages/node-wizard/manual-claim.html'
      })
      .state('material.nodewizard.adddevice', {
        url: '/add-device/:nodeTypeId',
        controller: 'addDeviceController',
        templateUrl: '/pages/node-wizard/add-device/index.html'
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
      .state('material.nodewizard.addchannel.tesla', {
        url: '/tesla',
        controller: 'addChannelTeslaController',
        templateUrl: '/pages/node-wizard/add-channel/tesla.html'
      })
      .state('material.nodewizard.addchannel.travis-ci', {
        url: '/travis-ci',
        controller: 'addChannelTravisCIController',
        templateUrl: '/pages/node-wizard/add-channel/travis-ci.html'
      })
      .state('material.nodewizard.addchannel.travis-ci-pro', {
        url: '/travis-ci-pro',
        controller: 'addChannelTravisCIProController',
        templateUrl: '/pages/node-wizard/add-channel/travis-ci.html'
      })
      .state('material.nodewizard.addchannel.littlebits', {
        url: '/littlebits',
        controller: 'addChannelLittlebitsController',
        templateUrl: '/pages/node-wizard/add-channel/littlebits.html'
      })
      .state('material.nodewizard.addchannel.wink', {
        url: '/wink',
        controller: 'addChannelWinkController',
        templateUrl: '/pages/node-wizard/add-channel/wink.html'
      })
      .state('material.nodewizard.addchannel.witai', {
        url: '/witai',
        controller: 'addChannelWitaiController',
        templateUrl: '/pages/node-wizard/add-channel/witai.html'
      })
      .state('material.nodewizard.addchannel.docusign', {
        url: '/docusign',
        controller: 'addChannelDocuSignController',
        templateUrl: '/pages/node-wizard/add-channel/docusign.html'
      })
      .state('material.nodewizard.addchannel.apikey', {
        url: '/apikey',
        controller: 'addChannelApiKeyController',
        templateUrl: '/pages/node-wizard/add-channel/apikey.html'
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
      .state('material.octos',{
        url: '/octos',
        controller: 'ListOctosController',
        controllerAs: 'controller',
        templateUrl: '/pages/list-octos.html'
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
      .state('material.nodewizard.addgateblu', {
        url: '/add-gateblu/:nodeTypeId',
        controller: 'addDeviceController',
        templateUrl: '/pages/node-wizard/add-gateblu/index.html'
      })
      .state('material.nodewizard.addsubdevice.addgateblu', {
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
      .state('material.process', {
        url: '/process',
        templateUrl: '/pages/process.html',
        controller: 'ProcessController'
      })
      .state('material.device', {
        url: '/device/:uuid',
        controller: 'DeviceDetailController',
        controllerAs: 'controller',
        templateUrl: '/pages/device-detail.html'
      })
      .state('material.deviceTab', {
        url: '/device/:uuid/:tab',
        controller: 'DeviceDetailController',
        controllerAs: 'controller',
        templateUrl: '/pages/device-detail.html'
      })
      .state('material.bluprints', {
        url: '/bluprints',
        templateUrl: '/pages/bluprints.html',
        controller: 'BluprintsController'
      })
      .state('material.bluprint', {
        url: '/bluprints/:bluprintId',
        templateUrl: '/pages/bluprints.html',
        controller: 'BluprintsController'
      })
      .state('material.discover', {
        url: '/discover',
        templateUrl: '/pages/shared-bluprints.html',
        controller: 'SharedBluprintsController',
        controllerAs: 'controller'
      })
      .state('material.discovercollection', {
        url: '/discover/:collection',
        templateUrl: '/pages/shared-bluprints.html',
        controller: 'SharedBluprintsController',
        controllerAs: 'controller'
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
      .state('contact', {
        url: '/contact',
        templateUrl: '/pages/contact.html',
        controller: 'contactController',
        unsecured: true
      })
      .state('material.profile', {
        url: '/profile',
        templateUrl: '/pages/profile.html',
        controller: 'profileController'
      })
      .state('profile-new', {
        url: '/profile/new',
        controller: 'NewProfileController',
        controllerAs: 'controller',
        templateUrl: '/pages/profile/new.html'
      })
      .state('material.resources', {
        url: '/resources',
        controller: 'ResourcesController',
        controllerAs: 'controller',
        templateUrl: '/pages/resources.html'
      })
      .state('login', {
        url: '/login',
        templateUrl: '/pages/login.html',
        controller: 'LoginController',
        controllerAs: 'controller',
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
      .state('material.oauth', {
        url: '/oauth/:uuid?redirect&response_type&redirect_uri',
        templateUrl : '/pages/oauth.html',
        controller: 'OAuthProviderController'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: '/pages/signup.html',
        controller: 'SignupController',
        controllerAs: 'controller',
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
    $urlRouterProvider.otherwise('/');
  })
  .run(function ($log, $rootScope, $window, $state, $urlRouter, $location, AuthService, $intercom, IntercomUserService, $cookies) {

    // $window.console.log = $log.debug;

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      console.log('error from ' + fromState.name + ' to ' + toState.name, error);
      console.log(error.stack);
    });

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
      $intercom.update();
      if (!toState.unsecured) {

        if(toState.name !== 'profile-new'){
          IntercomUserService.updateIntercom().catch(function(error){
            if(error.message === 'meshblu connection error'){
              return;
            }
            $state.go('profile-new');
          });
        }

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
