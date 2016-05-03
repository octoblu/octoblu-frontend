class FlowPermissionManagerController
  constructor: ($q, $scope, $state, $http, ThingService, REGISTRY_URL) ->
    @scope        = $scope
    @q            = $q
    @ThingService = ThingService
    @REGISTRY_URL = REGISTRY_URL
    @http         = $http
    @scope.$watchCollection 'flow.nodes', @renderFlow

  renderFlow: (nodes) =>
    return unless nodes?
    {flowId} = @scope.flow
    @getDevicesWithPermissionsFromNodes({flowId, nodes})
      .then (@devicesWithPermissions) =>
        @getDevicesFromRegistry {flowId, nodes}
      .then (registryDevices) =>
        @devicesWithPermissions = _.union @devicesWithPermissions, registryDevices
        @devicesNeedingPermission = _.filter @devicesWithPermissions, ({permissions}) =>
          _.includes _.values(permissions), false

  getDevicesWithPermissionsFromNodes: ({flowId, nodes}) =>
    @getDevicesFromNodes(nodes)
      .then (devices) =>
        @getDevicesWithPermissions {flowId, devices}

  getDevicesFromRegistry: ({flowId, nodes}) =>
    @http.get @REGISTRY_URL
      .then ({data}) =>
        @ThingService.getThing(uuid: flowId)
          .then (flowDevice) =>
            _.compact _.map _.uniq(nodes, 'uuid'), (node) =>
              return unless node.type?
              type = node.type.replace /operation:/, ''
              type = type.replace /:.*/, ''
              return unless data[type]?.sendWhitelist?
              device =
                logo: node.logo
                name: node.name || node.uuid
                uuid: node.uuid

              deviceWithPermissions =
                device: device
                permissions:
                  messageToFlow: @_canMessageToFlow {device, flowDevice}

  _canMessageToFlow: ({device, flowDevice}) =>
    console.log 'sendWhitelist',  flowDevice.sendWhitelist
    return true if _.includes flowDevice.sendWhitelist, '*'
    return true if _.includes flowDevice.sendWhitelist, device.uuid
    false

  _canMessageFromFlow: ({device, flowDevice}) =>
    return true if _.includes device.sendWhitelist, '*'
    return true if _.includes device.sendWhitelist, flowDevice.uuid
    false

  _canSubscribeBroadcastSent: ({device, flowDevice}) =>
    return true if _.includes device.receiveAsWhitelist, '*'
    return true if _.includes device.receiveAsWhitelist, flowDevice.uuid
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
