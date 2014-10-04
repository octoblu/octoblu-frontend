'use strict';

angular.module('octobluApp')
.controller('addChannelExistingController', function($scope, $state, nodeType, channelService) {
  var AUTH_DESTINATIONS = {
    'aws'     : 'ob.nodewizard.addchannel.aws',
    'basic'   : 'ob.nodewizard.addchannel.basic',
    'meshblu' :'ob.nodewizard.addchannel.meshblu',
    'none'    : 'ob.nodewizard.addchannel.noauth',
    'oauth'   : 'ob.nodewizard.addchannel.oauth',
    'simple'  : 'ob.nodewizard.addchannel.simple'
  };

  channelService.getChannelActivationById(nodeType.channelid).then(function(channelActivation){
    $scope.existingChannel = channelActivation;

    if($scope.existingChannel){return;}

    channelService.getById(nodeType.channelid).then(function(channel){
      var auth_strategy = channel.auth_strategy;
      $state.go(AUTH_DESTINATIONS[auth_strategy], {}, {location: 'replace'});
    })
  });
});
