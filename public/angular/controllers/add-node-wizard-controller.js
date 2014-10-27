angular.module('octobluApp')
.controller('AddNodeWizardController', function($scope, $state, NodeTypeService) {
  'use strict';

  NodeTypeService.getById($state.params.nodeTypeId).then(function(nodeType){
    var state = 'ob.nodewizard.adddevice';

    if(nodeType.type === 'device:gateblu'){
      state = 'ob.nodewizard.addgateblu';
    }

    if(nodeType.category === 'channel'){
      state = 'ob.nodewizard.addchannel.default-options';
    }

    if(nodeType.connector){
      state = 'ob.nodewizard.addsubdevice.selectgateblu';
    }


    $state.go(state, {nodeTypeId : $state.params.nodeTypeId}, {location: 'replace'});
  });
});
