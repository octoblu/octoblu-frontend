angular.module('octobluApp')
.controller('AddNodeWizardController', function(OCTOBLU_API_URL, $scope, $state, NodeTypeService) {
  'use strict';

  NodeTypeService.getById($state.params.nodeTypeId).then(function(nodeType){
    var state = 'material.nodewizard.adddevice';

    if(nodeType.type === 'device:gateblu'){
      state = 'material.nodewizard.addgateblu';
    }

    if(nodeType.category === 'channel'){
      state = 'material.nodewizard.addchannel.default-options';
    }

    if(nodeType.connector){
      state = 'material.nodewizard.addsubdevice.selectgateblu';
    }


    $state.go(state, {nodeTypeId : $state.params.nodeTypeId}, {location: 'replace'});
  });
});
