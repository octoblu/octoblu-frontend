angular.module('octobluApp')
.controller('AddNodeWizardController', function($scope, $state, NodeTypeService) {
  'use strict';

<<<<<<< HEAD
  var STATES = {
    'channel': 'ob.nodewizard.addchannel.existing',
    'device': 'ob.nodewizard.adddevice',
    'microblu': 'ob.nodewizard.addmicroblu',
    'gateway': 'ob.nodewizard.addgateway',
    'subdevice': 'ob.nodewizard.addsubdevice.selectgateway'
  };

=======
>>>>>>> FETCH_HEAD
  NodeTypeService.getById($state.params.nodeTypeId).then(function(nodeType){
    var state = 'ob.nodewizard.adddevice';

    if(nodeType.type === 'device:gateblu'){
      state = 'ob.nodewizard.addgateblu';
    }

    if(nodeType.category === 'channel'){
      state = 'ob.nodewizard.addchannel.existing';
    }

    if(nodeType.gatebluCapable){
      state = 'ob.nodewizard.addsubdevice.selectgateblu';
    }


    $state.go(state, {nodeTypeId : $state.params.nodeTypeId}, {location: 'replace'});
  });
});
