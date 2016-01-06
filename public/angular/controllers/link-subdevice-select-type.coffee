class LinkSubdeviceSelectTypeController
  constructor: ($scope, $state, $stateParams, $cookies, NodeTypeService) ->
    {@device, @gateblu} = $scope.subdeviceLink
    {@subdeviceLink} = $scope
    @state = $state
    NodeTypeService.getSubdeviceNodeTypes().then (@nodeTypes) =>

  selectNodeType: (nodeType) =>
    @subdeviceLink.nodeType = nodeType
    @state.go 'material.nodewizard-linksubdevice.form'


angular.module('octobluApp').controller 'LinkSubdeviceSelectTypeController', LinkSubdeviceSelectTypeController
