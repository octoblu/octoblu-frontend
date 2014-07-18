'use strict';

angular.module('octobluApp')
    .controller('addChannelExistingController', function($scope, $state, nodeType, channelService) {
        var AUTH_DESTINATIONS = {
            'none':   'ob.nodewizard.addchannel.noauth',
            'simple': 'ob.nodewizard.addchannel.simple',
            'oauth':  'ob.nodewizard.addchannel.oauth'
        };

        channelService.getActiveChannelByName(nodeType.name)
        .then(function(channel){
            $scope.existingChannel = channel;

            if($scope.existingChannel){return;}

            var auth_strategy = nodeType.channel.auth_strategy;
            return $state.go(AUTH_DESTINATIONS[auth_strategy]);
        });
    });
