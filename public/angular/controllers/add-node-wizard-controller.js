angular.module('octobluApp')
.controller('AddNodeWizardController', function($scope, $state, NodeTypeService) {
  'use strict';

  NodeTypeService.getById($state.params.nodeTypeId).then(function(nodeType){
    var state = 'ob.nodewizard.adddevice';

    if(nodeType.category === 'channel'){
      state = 'ob.nodewizard.addchannel.existing';
    }

    if(nodeType.genbluCapable){
      state = 'ob.nodewizard.addsubdevice.selectgenblu';
    }

    $state.go(state, {nodeTypeId : $state.params.nodeTypeId}, {location: 'replace'});
  });
});
