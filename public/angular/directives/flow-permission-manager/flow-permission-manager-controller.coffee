class FlowPermissionManagerController
  constructor: ($q, $scope, $state, ThingService, NodeRegistryService) ->
    @scope      = $scope
    @q          = $q
    @ThingService = ThingService
    @scope.$watchCollection 'flow.nodes', @renderFlow

  renderFlow: (nodes) =>
    return unless nodes?
    {flowId} = @scope.flow
    @getDevicesWithPermissionsFromNodes({flowId, nodes})
      .then (@devicesWithPermissions) =>
        @devicesNeedingPermission = _.filter @devicesWithPermissions, ({permissions}) =>
          _.includes _.values(permissions), false

  getDevicesWithPermissionsFromNodes: ({flowId, nodes}) =>
    @getDevicesFromNodes(nodes)
      .then (devices) =>
        @getDevicesWithPermissions {flowId, devices}

  _canMessageToFlow: ({device, flowDevice}) =>
    return true unless _.includes flowDevice.receiveAsWhitelist, '*'
    return true unless _.includes flowDevice.receiveAsWhitelist, device.uuid
    false

  _canMessageFromFlow: ({device, flowDevice}) =>
    return true unless _.includes device.sendWhitelist, '*'
    return true unless _.includes device.sendWhitelist, flowDevice.uuid
    false

  _canSubscribeBroadcastSent: ({device, flowDevice}) =>
    return true unless _.includes device.receiveAsWhitelist, '*'
    return true unless _.includes device.receiveAsWhitelist, flowDevice.uuid
    false

  getDevicesWithPermissions: ({flowId, devices}) =>
    @ThingService.getThing {uuid: flowId}
      .then (flowDevice) =>
        _.map devices, (device) =>
          @getDeviceWithPermissions {flowDevice, device}

  getDeviceWithPermissions: ({flowDevice, device}) =>
    deviceWithPermissions =
      device: device
      permissions:
        messageToFlow: @_canMessageToFlow {device, flowDevice}
        messageFromFlow: @_canMessageFromFlow {device, flowDevice}
        subscribeBroadcastSent: @_canSubscribeBroadcastSent {device, flowDevice}

  getDeviceNodes: (nodes) =>
    _.filter nodes, (node) =>
      node.meshblu || node.class == 'device-flow'

  getDevicesFromNodes: (nodes) =>
    nodes = _.uniq @getDeviceNodes(nodes), 'uuid'
    promises = _.map nodes, @ThingService.getThing
    return @q.all promises

angular.module('octobluApp').controller 'FlowPermissionManagerController', FlowPermissionManagerController
