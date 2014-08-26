'use strict';

angular.module('octobluApp')
    .controller('addChannelExistingController', function($scope, $state, nodeType, channelService) {
        var AUTH_DESTINATIONS = {
            'none':   'ob.nodewizard.addchannel.noauth',
            'simple': 'ob.nodewizard.addchannel.simple',
            'basic':  'ob.nodewizard.addchannel.basic',
            'oauth':  'ob.nodewizard.addchannel.oauth'
        };

        channelService.getById(nodeType.channelid).then(function(channel){
            $scope.existingChannel = channel;

            if($scope.existingChannel){return;}

            var auth_strategy = channel.auth_strategy;
            return $state.go(AUTH_DESTINATIONS[auth_strategy], {}, {location: 'replace'});
        });
    });
