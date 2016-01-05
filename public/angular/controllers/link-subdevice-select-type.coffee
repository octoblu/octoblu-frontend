class LinkSubdeviceSelectTypeController
  constructor: ($scope, $state, $stateParams, $cookies, NodeTypeService) ->
    {@device} = $scope.subdeviceLink
    {@subdeviceLink} = $scope
    @state = $state
    NodeTypeService.getSubdeviceNodeTypes().then (@nodeTypes) =>

  selectNodeType: (nodeType) =>
    @device.category = nodeType.category
    @device.connector = nodeType.connector
    @state.go 'material.nodewizard-linksubdevice.selectgateblu'

angular.module('octobluApp').controller 'LinkSubdeviceSelectTypeController', LinkSubdeviceSelectTypeController
