class FlowModel
  constructor: (options, {UUIDService, ThingService, $q, $http, REGISTRY_URL}) ->
    @UUIDService  = UUIDService
    @ThingService = ThingService
    @q            = $q
    @http         = $http
    @REGISTRY_URL = REGISTRY_URL

    {
      @flowId
      @token
      @name
      @description
      @hash
      @nodes
      @links
    } = options

    @flowId ?= UUIDService.v1()
    @nodes ?= []
    @links ?= []

  updatePendingPermissions: =>
    promises = _.map(@devicesNeedingPermission, @_updatePermission)
    promises.push @_updateFlowSendWhitelist()

    @q.all promises
      .then @getDevicesNeedingPermissions

  getDevicesNeedingPermissions: =>
    @ThingService.getThing(uuid: @flowId)
      .then (@flowDevice) =>
        @q.all [
          @_getDevicesWithPermissionsFromNodes()
          @_getDevicesFromRegistry()
        ]
      .then ([devicesWithPermissionsFromNodes, registryDevices]) =>
        @devicesWithPermissions = _.union devicesWithPermissionsFromNodes, registryDevices
        @devicesNeedingPermission = _.filter @devicesWithPermissions, ({permissions}) =>
          _.includes _.values(permissions), false
        @pendingPermissions = ! _.isEmpty @devicesNeedingPermission

  _getDevicesFromRegistry: =>
    @http.get @REGISTRY_URL
      .then ({data}) =>
        _.compact _.map _.uniq(@nodes, 'uuid'), (node) =>
          return unless node.type?
          type = node.type.replace /operation:/, ''
          type = type.replace /:.*/, ''
          console.log type, data[type]?.sendWhitelist
          return unless data[type]?.sendWhitelist?
          device =
            logo: node.logo
            name: node.name || node.uuid
            uuid: node.uuid

          deviceWithPermissions =
            device: device
            permissions:
              messageToFlow: @_deviceCanMessageFlow device

  _getDevicesWithPermissionsFromNodes: =>
    @_getDevicesFromNodes()
      .then (devices) =>
        @_getDevicesWithPermissions devices

  _getDevicesFromNodes: =>
    deviceNodes = _.uniq @_getDeviceNodes(), 'uuid'
    promises = _.map deviceNodes, ThingService.getThing
    return @q.all promises

  _getDeviceNodes: =>
    _.filter @nodes, (node) =>
      node?.meshblu || node?.class == 'device-flow'

  _getDevicesWithPermissions: (devices) =>
    _.map devices, @_getDeviceWithPermissions

  _getDeviceWithPermissions: (device) =>
    deviceWithPermissions =
      device: device
      permissions:
        messageToFlow: @_deviceCanMessageFlow device
        messageFromFlow: @_flowCanMessageDevice device
        subscribeBroadcastSent: @_flowCanSubscribeBroadcastSentDevice device

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

  _updatePermission: ({device, permissions}) =>
    update = @_buildUpdate permissions
    @ThingService.updateDangerously(device.uuid, update) if update?

  _buildUpdate: (permissions) =>
    update =
      $addToSet: {}
    update.$addToSet.sendWhitelist = @flowDevice.uuid if permissions.messageFromFlow?
    update.$addToSet.receiveWhitelist = @flowDevice.uuid if permissions.subscribeBroadcastSent?

    return if _.isEmpty update.$addToSet
    return update

  _updateFlowSendWhitelist: =>
    devicesToAdd = _.filter @devicesNeedingPermission, ({permissions}) =>
      permissions.messageToFlow == false

    update =
      $pushAll:
        sendWhitelist: _.map devicesToAdd, ({device}) => device.uuid

    @ThingService.updateDangerously(@flowDevice.uuid, update)


angular.module('octobluApp').service 'FlowModel', (UUIDService, ThingService, $q, $http, REGISTRY_URL) ->
  (options) ->
    new FlowModel options, {UUIDService, ThingService, $q, $http, REGISTRY_URL}
