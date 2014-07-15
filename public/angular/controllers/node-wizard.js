'use strict';

angular.module('octobluApp')
    .controller('nodeWizardController', function($scope, $location, $state, channelService, AuthService) {
        channelService.getDeviceTypes().then(function(nodeTypes){
            $scope.nodeTypes = nodeTypes;
        });

        $scope.nextStepUrl = function(nodeType){
            var category, sref;
            category = (nodeType.category || 'device');
            sref     = 'ob.nodewizard.add'+category;
            return $state.href(sref, {deviceId: nodeType._id});
        };
    });
