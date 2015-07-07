'use strict';

angular.module('octobluApp')
.controller('addDefaultOptionsController', function(OCTOBLU_API_URL, $scope, $state, nodeType, userService, channelService, AuthService) {
	var AUTH_DESTINATIONS = {
    'aws'                    : 'material.nodewizard.addchannel.aws',
    'basic'                  : 'material.nodewizard.addchannel.basic',
    'clouddotcom'            : 'material.nodewizard.addchannel.clouddotcom',
    'meshblu'                : 'material.nodewizard.addchannel.meshblu',
    'none'                   : 'material.nodewizard.addchannel.noauth',
    'oauth'                  : 'material.nodewizard.addchannel.oauth',
    'simple'                 : 'material.nodewizard.addchannel.simple',
    'echosign'               : 'material.nodewizard.addchannel.echosign',
    'apikey-basic'           : 'material.nodewizard.addchannel.apikey-basic',
    'header'                 : 'material.nodewizard.addchannel.header',
    'existing'               : 'material.nodewizard.addchannel.existing',
    'docusign'               : 'material.nodewizard.addchannel.docusign',
    'apikey-dummypass-basic' : 'material.nodewizard.addchannel.apikey-dummypass-basic',
    'apikey'                 : 'material.nodewizard.addchannel.apikey',
    'littlebits'             : 'material.nodewizard.addchannel.littlebits',
    'tesla'                  : 'material.nodewizard.addchannel.tesla',
    'travis-ci'              : 'material.nodewizard.addchannel.travis-ci',
    'travis-ci-pro'          : 'material.nodewizard.addchannel.travis-ci-pro',
    'witai'                  : 'material.nodewizard.addchannel.witai',
    'wink'                   : 'material.nodewizard.addchannel.wink'
  };

	$scope.isLoadingOptions = true;

  $scope.channelDefaultParams = {};

  $scope.saveDefaultParams = function(){
    AuthService.getCurrentUser().then(function(user){
      userService.saveConnection(
        user.resource.uuid,
        nodeType.channelid,
        undefined,
        undefined,
        {},
        function () {
          $scope.goToNextStep();
        },
        $scope.channelDefaultParams);
    });
  };

  $scope.goToNextStep = function(){
  	var auth_strategy;

  	if($scope.existingChannel){
  		auth_strategy = 'existing';
			$scope.isLoadingOptions = false;
  	}else{
	  	if(!$scope.channel) return;
  		auth_strategy = $scope.channel.auth_strategy;
			$scope.isLoadingOptions = false;
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

					$scope.isLoadingOptions = false;
  			});
	  });
});
