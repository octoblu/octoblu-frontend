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

  toJSON: =>
    {
      @flowId
      @token
      @name
      @description
      @hash
      @links
      nodes: @nodesForJSON()
    }

  updatePendingPermissions: =>
    promises = _.map(@devicesNeedingPermission, @_updatePermission)
    promises.push @_updateFlowSendWhitelist()

    @q.all promises
      .then @getDevicesNeedingPermissions

  nodesForJSON: =>
    _.map @nodes, (node) =>
      _.omit node, 'defaults', 'formTemplatePath', 'helpText', 'logo', 'input', 'output'

  getDevicesNeedingPermissions: =>
    @ThingService.getThing(uuid: @flowId)
      .then (@flowDevice) =>
        @q.all [
          @_getDevicesWithPermissionsFromNodes()
          @_getDevicesFromRegistry()
        ]
      .then ([devicesWithPermissionsFromNodes, registryDevices]) =>
        @devicesWithPermissions = _.union devicesWithPermissionsFromNodes, registryDevices, 'uuid'
        @devicesNeedingPermission = _.filter @devicesWithPermissions, ({permissions}) =>
          _.includes _.values(permissions), false
        @pendingPermissions = ! _.isEmpty @devicesNeedingPermission

  _getDevicesFromRegistry: =>
    @http.get @REGISTRY_URL
      .then ({data}) =>
        sendWhitelistUuids = _.uniq _.compact _.flatten _.map @nodes, (node) =>
          return unless node.type?
          type = node.type.replace /operation:/, ''
          type = type.replace /:.*/, ''
          data[type]?.sendWhitelist

        @q.all _.map sendWhitelistUuids, @_getRegistryDevice

  _getRegistryDevice: (uuid) =>
    @ThingService.getThing {uuid}
      .then (device) =>
        deviceWithPermissions =
          device: device
          permissions:
            messageToFlow: @_deviceCanMessageFlow device
      .catch (error) =>
        device =
            logo: 'https://icons.octoblu.com/unknown-device.svg'
            name: 'Unknown Device'
            uuid: uuid
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
    promises = _.map deviceNodes, @ThingService.getThing
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
