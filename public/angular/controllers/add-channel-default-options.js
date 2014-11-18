'use strict';

angular.module('octobluApp')
.controller('addDefaultOptionsController', function($scope, $state, nodeType, userService, channelService, currentUser) {
	var AUTH_DESTINATIONS = {
    'aws'                    : 'ob.nodewizard.addchannel.aws',
    'basic'                  : 'ob.nodewizard.addchannel.basic',
    'clouddotcom'            : 'ob.nodewizard.addchannel.clouddotcom',
    'meshblu'                : 'ob.nodewizard.addchannel.meshblu',
    'none'                   : 'ob.nodewizard.addchannel.noauth',
    'oauth'                  : 'ob.nodewizard.addchannel.oauth',
    'simple'                 : 'ob.nodewizard.addchannel.simple',
    'echosign'               : 'ob.nodewizard.addchannel.echosign',
    'apikey-basic'           : 'ob.nodewizard.addchannel.apikey-basic',
    'header'                 : 'ob.nodewizard.addchannel.header',
    'existing'               : 'ob.nodewizard.addchannel.existing',
    'docusign'               : 'ob.nodewizard.addchannel.docusign',
    'apikey-dummypass-basic' : 'ob.nodewizard.addchannel.apikey-dummypass-basic'
  };

  $scope.channelDefaultParams = {};

  $scope.saveDefaultParams = function(){
  	userService
  		.saveConnection(
  				currentUser.skynet.uuid,
  				nodeType.channelid,
  				undefined,
  				undefined,
  				{},
          function () {
              $scope.goToNextStep();
          },
          $scope.channelDefaultParams);
  };

  $scope.goToNextStep = function(){
  	var auth_strategy;

  	if($scope.existingChannel){
  		auth_strategy = 'existing';
  	}else{
	  	if(!$scope.channel) return;
  		auth_strategy = $scope.channel.auth_strategy;
  	}

		$state.go(AUTH_DESTINATIONS[auth_strategy], {}, {location: 'replace'});
  };

  function convertParamsToObject(params){
    var newObject = {};
    _.each(params, function(param){
      newObject[param.name] = param.value;
    });
    return newObject;
  }

	channelService.getChannelActivationById(nodeType.channelid)
		.then(function(channelActivation){
	    $scope.existingChannel = channelActivation;
	    if($scope.existingChannel){
	    	$scope.goToNextStep();
	    	return;
	    }

	    channelService.getById(nodeType.channelid)
  			.then(function(channel){
          $scope.channel = channel;
          _.extend($scope.channelDefaultParams, convertParamsToObject(channel.defaultParams));
  				if(_.isEmpty(channel.defaultParams)){
            if(!_.isEmpty($scope.channelDefaultParams)){
              $scope.saveDefaultParams();
            }else{
              $scope.goToNextStep();
            }
  				}
  			});
	  });
});
