'use strict';

angular.module('octobluApp')
    .controller('devtoolsController', function ($rootScope, $scope, $http, $injector, $location, $modal, $log, $q, $state,
                                                ownerService, deviceService, channelService) {
        $scope.skynetStatus = false;
        $scope.channelList = [];
        $scope.predicate = 'name';

        $rootScope.checkLogin($scope, $http, $injector, true, function () {
            $scope.navType = 'pills';

            // connect to skynet
            var skynetConfig = {
                'host': 'skynet.im',
                'port' : 80,
                "uuid": $scope.skynetuuid,
                "token": $scope.skynettoken
            };

            skynet(skynetConfig, function (e, socket) {
                if (e) throw e;

                channelService.getCustomList($scope.skynetuuid, function(data) {
                  $log.info(data);
                  $scope.customchannelList = data;
                });

                $scope.openNewApi = function() { $state.go('connector.channels.editor', { name: 'new' }); };
                $scope.openDetails = function (channel) { $state.go('connector.channels.detail', { name: channel.name }); };

                $scope.isActive = function (channel) {
                    if($scope.current_user.api) {
                        for(var l = 0; l<$scope.current_user.api.length; l++) {
                            if($scope.current_user.api[l].name===channel.name) {return true;}
                        }
                    }
                    return false;
                };

                $scope.isInactive = function (channel) {
                    if($scope.current_user.api) {
                        for(var l = 0; l<$scope.current_user.api.length; l++) {
                            if($scope.current_user.api[l].name===channel.name) {return false;}
                        }
                    }
                    return true;
                };

            }); //end skynet.js

        });

    });