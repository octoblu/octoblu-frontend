class FlowPermissionManagerController
  constructor: ($scope, $state, ThingService, $q) ->
    @scope      = $scope
    @q          = $q
    @ThingService = ThingService
    @scope.$watchCollection 'flow.nodes', @renderFlow

  renderFlow: (nodes) =>
    return unless nodes?
    {flowId} = @scope.flow
    @getDevicesNeedingUpdates({flowId, nodes})
      .then (@devices) =>
        console.log('@devices', @devices)

  getDevicesNeedingUpdates: ({flowId, nodes}) =>
    @getDevicesFromNodes(nodes)
      .then (devices) =>
        @getDevicesNeedingPermissions {flowId, devices}

  getDevicesNeedingPermissions: ({flowId, devices}) =>
    @ThingService.getThing {uuid: flowId}
      .then (flowDevice) =>
        noSendWhitelist = _.reject devices, (device) =>
          return false if _.includes device.sendWhitelist, '*'
          return false if _.includes device.sendWhitelist, flowId
          return true

        noReceiveAsWhitelist = _.reject devices, (device) =>
          return false if _.includes device.receiveAsWhitelist, '*'
          return false if _.includes device.receiveAsWhitelist, flowId
          return true

        cantSendToFlow = _.reject devices, (device) =>
          return false if _.includes flowDevice.receiveAsWhitelist, '*'
          return false if _.includes flowDevice.receiveAsWhitelist, device.uuid
          return true

        _.union noSendWhitelist, noReceiveAsWhitelist, cantSendToFlow

  getDeviceNodes: (nodes) =>
    _.filter nodes, (node) =>
      node.meshblu || node.class == 'device-flow'

  getDevicesFromNodes: (nodes) =>
    nodes = _.uniq @getDeviceNodes(nodes), 'uuid'
    promises = _.map nodes, @ThingService.getThing
    return @q.all promises

angular.module('octobluApp').controller 'FlowPermissionManagerController', FlowPermissionManagerController
