{_, angular} = window

class PermissionManager
  constructor: (options, {ThingService, $q, $http, REGISTRY_URL}) ->
    @ThingService = ThingService
    @q            = $q
    @http         = $http
    @REGISTRY_URL = REGISTRY_URL
    {@flow} = options

  updatePendingPermissions: =>
    @ThingService.getThing(uuid: @flow.flowId)
      .then (@flowDevice) =>
        promises = _.map(@flow.devicesNeedingPermission, @_updatePermission)
        promises.push @_updateFlowSendWhitelist()

        @q.all promises
          .then @getDevicesNeedingPermissions

  getDevicesNeedingPermissions: =>
    @ThingService.getThing(uuid: @flow.flowId)
      .then (@flowDevice) =>
        @q.all [
          @_getDevicesWithPermissionsFromNodes()
          @_getDevicesFromRegistry()
        ]
      .then ([devicesWithPermissionsFromNodes, registryDevices]) =>
        @flow.devicesWithPermissions = _.union _.compact(devicesWithPermissionsFromNodes), registryDevices, 'uuid'
        @flow.devicesNeedingPermission = _.filter @flow.devicesWithPermissions, ({devices, permissions}) =>
          _.includes _.values(permissions), false
        @flow.pendingPermissions = ! _.isEmpty @flow.devicesNeedingPermission
      .catch (error) =>
        console.error 'promises, promises', error

  _getDevicesFromRegistry: =>
    @http.get @REGISTRY_URL
      .then ({data}) =>
        sendWhitelistUuids = _.uniq _.compact _.flatten _.map @flow.nodes, (node) =>
          return unless node.type?
          type = node.type.replace /operation:/, ''
          type = type.replace /:.*/, ''
          data[type]?.sendWhitelist
        @q.all _.map sendWhitelistUuids, @_getRegistryDevice

  _getRegistryDevice: (uuid) =>
    @ThingService.getThing {uuid}
      .then (device) =>
        return {
          device: device
          permissions:
            messageToFlow: @_deviceCanMessageFlow device
        }
      .catch (error) =>
        console.error '_getRegistryDevice error:', error
        device = {
          logo: 'https://icons.octoblu.com/unknown-device.svg'
          name: 'Unknown Device'
          uuid: uuid
        }
        return {
          device: device
          permissions:
            messageToFlow: @_deviceCanMessageFlow device
        }

  _getDevicesWithPermissionsFromNodes: =>
    @_getDevicesFromNodes()
      .then (devices) =>
        @_getDevicesWithPermissions _.compact devices

  _getDevicesFromNodes: =>
    deviceNodes = _.uniq @_getDeviceNodes(), 'uuid'
    promises = _.map deviceNodes, (node) =>
      @ThingService.getThing(node)
        .catch (error) => console.warn 'ignored: ', error
    return @q.all promises

  _getDeviceNodes: =>
    _.filter @flow.nodes, (node) =>
      node?.meshblu || node?.class == 'device-flow'

  _getDevicesWithPermissions: (devices) =>
    _.map devices, @_getDeviceWithPermissions

  _getDeviceWithPermissions: (device) =>
    permissions = {}
    eventTypesForDevice = _(@flow.nodes)
      .filter(uuid: device.uuid)
      .map (node) => node.eventType || 'message'
      .uniq()
      .value()

    _.extend permissions, @_getMessagePermissions device if _.includes eventTypesForDevice, 'message'
    _.extend permissions, @_getConfigurePermissions device if _.includes eventTypesForDevice, 'configure'

    return { device, permissions }

  _getMessagePermissions: (device) =>
    return {
      messageToFlow: @_deviceCanMessageFlow device
      messageFromFlow: @_flowCanMessageDevice device
      subscribeBroadcastSent: @_flowCanSubscribeBroadcastSentDevice device
    }

  _getConfigurePermissions: (device) =>
    return {
      configureFromFlow: @_flowCanConfigureDevice device
      discoverFromFlow: @_flowCanDiscoverDevice device
    }

  _flowCanConfigureDevice: (device) =>
    return true if @flowDevice.uuid == device.uuid
    return @_flowCanConfigureDeviceV2 device if device.meshblu.version == "2.0.0"
    return true if _.includes device.configureWhitelist, '*'
    return true if _.includes device.configureWhitelist, @flowDevice.uuid

    false

  _flowCanConfigureDeviceV2: (device) =>
    return true if _.some device.meshblu?.whitelists?.configure?.update, uuid: '*'
    return true if _.some device.meshblu?.whitelists?.configure?.update, uuid: @flowDevice.uuid

    false

  _flowCanDiscoverDevice: (device) =>
    return true if @flowDevice.uuid == device.uuid
    return @_flowCanDiscoverDeviceV2 device if device.meshblu.version == "2.0.0"
    return true if _.includes device.discoverWhitelist, '*'
    return true if _.includes device.discoverWhitelist, @flowDevice.uuid

    false

  _flowCanDiscoverDeviceV2: (device) =>
    return true if _.some device.meshblu?.whitelists?.discover?.view, uuid: '*'
    return true if _.some device.meshblu?.whitelists?.discover?.view, uuid: @flowDevice.uuid

    false


  _deviceCanMessageFlow: (device) =>
    return true if @flowDevice.uuid == device.uuid
    return true if _.includes @flowDevice.sendWhitelist, '*'
    return true if _.includes @flowDevice.sendWhitelist, device.uuid

    false

  _flowCanMessageDevice: (device) =>
    return true if @flowDevice.uuid == device.uuid
    return @_flowCanMessageDeviceV2 device if device.meshblu.version == "2.0.0"
    return true if _.includes device.sendWhitelist, '*'
    return true if _.includes device.sendWhitelist, @flowDevice.uuid

    false

  _flowCanMessageDeviceV2: (device) =>
    return true if _.some device.meshblu?.whitelists?.message?.from, uuid: '*'
    return true if _.some device.meshblu?.whitelists?.message?.from, uuid: @flowDevice.uuid

    false

  _flowCanSubscribeBroadcastSentDevice: (device) =>
    return true if @flowDevice.uuid == device.uuid
    return @_flowCanSubscribeBroadcastSentDeviceV2 device if device.meshblu.version == "2.0.0"

    return true if _.includes device.receiveAsWhitelist, '*'
    return true if _.includes device.receiveAsWhitelist, @flowDevice.uuid

    return true if _.includes device.receiveWhitelist, '*'
    return true if _.includes device.receiveWhitelist, @flowDevice.uuid

    false

  _flowCanSubscribeBroadcastSentDeviceV2: (device) =>
    return true if _.some device.meshblu?.whitelists?.broadcast?.sent, uuid: '*'
    return true if _.some device.meshblu?.whitelists?.broadcast?.sent, uuid: @flowDevice.uuid

    false

  _updatePermission: ({device, permissions}) =>
    if device.meshblu?.version == '2.0.0'
      update = @_buildUpdateV2 permissions
    else
      update = @_buildUpdate permissions

    @ThingService.updateDangerously(device.uuid, update) if update?

  _buildUpdate: (permissions) =>
    update = $addToSet: {}
    update.$addToSet.sendWhitelist = @flowDevice.uuid if permissions.messageFromFlow == false
    update.$addToSet.receiveWhitelist = @flowDevice.uuid if permissions.subscribeBroadcastSent == false
    update.$addToSet.configureWhitelist = @flowDevice.uuid if permissions.configureFromFlow == false
    update.$addToSet.discoverWhitelist = @flowDevice.uuid if permissions.discoverFromFlow == false

    return if _.isEmpty update.$addToSet
    return update

  _buildUpdateV2: (permissions) =>
    update = $addToSet: {}
    update.$addToSet['meshblu.whitelists.message.from']   = uuid: @flowDevice.uuid if permissions.messageFromFlow == false
    update.$addToSet['meshblu.whitelists.broadcast.sent'] = uuid: @flowDevice.uuid if permissions.subscribeBroadcastSent == false
    update.$addToSet['meshblu.whitelists.configure.update'] = uuid: @flowDevice.uuid if permissions.configureFromFlow == false
    update.$addToSet['meshblu.whitelists.discover.view'] = uuid: @flowDevice.uuid if permissions.discoverFromFlow == false

    return if _.isEmpty update.$addToSet
    return update

  _updateFlowSendWhitelist: =>
    devicesToAdd = _.filter @flow.devicesNeedingPermission, ({permissions}) =>
      permissions.messageToFlow == false

    update =
      $pushAll:
        sendWhitelist: _.map devicesToAdd, ({device}) => device.uuid

    @ThingService.updateDangerously(@flowDevice.uuid, update)

class FlowPermissionService
  constructor: (ThingService, $q, $http, REGISTRY_URL) ->
    @depends = {ThingService, $q, $http, REGISTRY_URL}

  createPermissionManager: (flow) =>
    return new PermissionManager {flow}, @depends

angular.module('octobluApp').service 'FlowPermissionService', FlowPermissionService
