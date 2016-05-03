class FlowPermissionManagerController
  constructor: ($q, $scope, $state, $http, ThingService, REGISTRY_URL) ->
    @scope        = $scope
    @q            = $q
    @ThingService = ThingService
    @REGISTRY_URL = REGISTRY_URL
    @http         = $http
    @loading      = true
    @scope.hideSection = true
    @scope.$watchCollection 'flow.nodes', @renderPermissionManager

  approveAll: =>
    promises = _.map(@devicesNeedingPermission, @updatePermission)
    promises.push @updateFlowSendWhitelist()

    @q.all(promises).then => @renderPermissionManager @scope.flow.nodes

  updatePermission: ({device, permissions}) =>
    update = @buildUpdate permissions
    @ThingService.updateDangerously(device.uuid, update) if update?

  buildUpdate: (permissions) =>
    update =
      $addToSet: {}
    update.$addToSet.sendWhitelist = @flowDevice.uuid if permissions.messageFromFlow?
    update.$addToSet.receiveWhitelist = @flowDevice.uuid if permissions.subscribeBroadcastSent?

    return if _.isEmpty update.$addToSet
    return update

  updateFlowSendWhitelist: =>
    devicesToAdd = _.filter @devicesNeedingPermission, ({permissions}) =>
      permissions.messageToFlow == false

    update =
      $pushAll:
        sendWhitelist: _.map devicesToAdd, ({device}) => device.uuid

    @ThingService.updateDangerously(@flowDevice.uuid, update)

  renderPermissionManager: (nodes) =>
    return unless nodes?
    return unless @scope.flow?
    {flowId} = @scope.flow
    @ThingService.getThing(uuid: flowId)
      .then (@flowDevice) =>
        @q.all [
          @getDevicesWithPermissionsFromNodes nodes
          @getDevicesFromRegistry nodes
        ]
      .then ([devicesWithPermissionsFromNodes, registryDevices]) =>
        @devicesWithPermissions = _.union devicesWithPermissionsFromNodes, registryDevices
        @devicesNeedingPermission = _.filter @devicesWithPermissions, ({permissions}) =>
          _.includes _.values(permissions), false
        @loading = false
        @scope.flow.pendingPermissions = ! _.isEmpty @devicesNeedingPermission
        @scope.hideSection = !@scope.flow.pendingPermissions

  getDevicesWithPermissionsFromNodes: (nodes) =>
    @getDevicesFromNodes(nodes)
      .then (devices) =>
        @getDevicesWithPermissions devices

  getDevicesFromRegistry: (nodes) =>
    @http.get @REGISTRY_URL
      .then ({data}) =>
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
              messageToFlow: @_deviceCanMessageFlow device

  _deviceCanMessageFlow: (device) =>
    return true if @flowDevice.uuid == device.uuid
    return true if _.includes @flowDevice.sendWhitelist, '*'
    return true if _.includes @flowDevice.sendWhitelist, device.uuid

    false

  _flowCanMessageDevice: (device) =>
    return true if @flowDevice.uuid == device.uuid
    return true if _.includes device.sendWhitelist, '*'
    return true if _.includes device.sendWhitelist, @flowDevice.uuid

    false

  _flowCanSubscribeBroadcastSentDevice: (device) =>
    return true if @flowDevice.uuid == device.uuid
    return true if _.includes device.receiveAsWhitelist, '*'
    return true if _.includes device.receiveAsWhitelist, @flowDevice.uuid

    return true if _.includes device.receiveWhitelist, '*'
    return true if _.includes device.receiveWhitelist, @flowDevice.uuid

    false

  getDevicesWithPermissions: (devices) =>
    _.map devices, (device) =>
      @getDeviceWithPermissions device

  getDeviceWithPermissions: (device) =>
    deviceWithPermissions =
      device: device
      permissions:
        messageToFlow: @_deviceCanMessageFlow device
        messageFromFlow: @_flowCanMessageDevice device
        subscribeBroadcastSent: @_flowCanSubscribeBroadcastSentDevice device

  getDeviceNodes: (nodes) =>
    _.filter nodes, (node) =>
      node?.meshblu || node?.class == 'device-flow'

  getDevicesFromNodes: (nodes) =>
    nodes = _.uniq @getDeviceNodes(nodes), 'uuid'
    promises = _.map nodes, @ThingService.getThing
    return @q.all promises

angular.module('octobluApp').controller 'FlowPermissionManagerController', FlowPermissionManagerController
