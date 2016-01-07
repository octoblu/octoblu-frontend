class LinkSubdeviceController
  constructor: ($scope, $state, $stateParams, ThingService, NodeTypeService) ->
    @state = $state
    ThingService.getThing(uuid: $stateParams.deviceUuid).then (device) =>
      $scope.subdeviceLink =
        device: _.cloneDeep device

      NodeTypeService.getNodeTypeByType device.type
        .then (nodeType) =>
          $scope.subdeviceLink.nodeType = nodeType if nodeType?.connector?
          @changeGateblu()

  changeNodeType: =>
    @state.go @SELECT_NODE_TYPE_STATE, {}, location: true

  changeGateblu: =>
    @state.go @SELECT_GATEBLU_STATE, {}, location: true

  useCustom: =>
    @state.go @SELECT_CUSTOM_TYPE, {}, location: true

  isSelectNodeType: =>
    @state.current.name == @SELECT_NODE_TYPE_STATE

  isSelectGateblu: =>
    @state.current.name == @SELECT_GATEBLU_STATE

  SELECT_GATEBLU_STATE: 'material.nodewizard-linksubdevice.selectgateblu'
  SELECT_NODE_TYPE_STATE: 'material.nodewizard-linksubdevice.selecttype'
  SELECT_CUSTOM_TYPE: 'material.nodewizard-linksubdevice.selectCustomType'


angular.module('octobluApp').controller 'LinkSubdeviceController', LinkSubdeviceController
