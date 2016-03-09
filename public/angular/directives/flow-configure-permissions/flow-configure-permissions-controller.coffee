class FlowConfigurePermissionsController
  constructor: ($scope, $q, FlowService, NodeRegistryService, ThingService, SERVICE_UUIDS) ->
    @scope               = $scope
    @q                   = $q
    @FlowService         = FlowService
    @ThingService        = ThingService
    @NodeRegistryService = NodeRegistryService
    @SERVICE_UUIDS       = SERVICE_UUIDS

    @permissionsUpdated  = true
    @permissionsLoading  = true

    @scope.$watch 'flow', (flow) =>
      return unless flow
      @checkPermissions()

    @scope.$on 'update-permissions', (event) =>
      return if @permissionsUpdated
      @updatePermissions()

  checkPermissions: =>
    { flow } = @scope
    { flowId, nodes } = flow

    @checkDevicePermission(flowId, nodes).then (thingsNeedingReceiveAs) =>
      @checkNodeRegistryPermissions(flowId, nodes).then (thingsNeedingSendWhitelist) =>
        @permissionsLoading = false
        @permissionsUpdated = false
        @permissionsUpdated = true unless thingsNeedingSendWhitelist || thingsNeedingReceiveAs

        @scope.$emit 'permissions-updated' if @permissionsUpdated

        @scope.thingsNeedingSendWhitelist = thingsNeedingSendWhitelist
        @scope.thingsNeedingReceiveAs = thingsNeedingReceiveAs

  checkDevicePermission: (flowId, nodes) =>
    deviceNodes = _.filter nodes, (node) => node.meshblu || node.class == 'device-flow'

    deviceUuids = _.pluck deviceNodes, 'uuid'
    @FlowService.needsPermissions(flowId, deviceUuids).
      then (thingsNeedingReceiveAs)=>
        return if _.isEmpty thingsNeedingReceiveAs
        thingsNeedingReceiveAs

  checkNodeRegistryPermissions: (flowId, nodes)=>
    nodeTypes = _.pluck nodes, 'type'
    @NodeRegistryService.needsPermissions(flowId, nodeTypes).
      then (thingsNeedingSendWhitelist)=>
        return if _.isEmpty thingsNeedingSendWhitelist
        thingsNeedingSendWhitelist

  checkForServiceNames: (uuid)=>
    return 'Trigger Service' if @SERVICE_UUIDS.TRIGGER == uuid
    return 'Interval Service' if @SERVICE_UUIDS.INTERVAL == uuid
    return 'Credential Service' if @SERVICE_UUIDS.CREDENTIALS == uuid
    uuid

  updatePermissions: () =>
    @addFlowToWhitelists()
    @addSendWhitelistsToFlow()
    @checkPermissions()

  addFlowToWhitelists: () =>
    { thingsNeedingReceiveAs, flow } = @scope
    deferred = @q.defer()

    return unless thingsNeedingReceiveAs
    async.each thingsNeedingReceiveAs, (thing)=>
      thing.receiveAsWhitelist = thing.receiveAsWhitelist || []
      thing.receiveAsWhitelist.push flow.flowId

      thing.receiveWhitelist = thing.receiveWhitelist || []
      thing.receiveWhitelist.push flow.flowId

      thing.sendWhitelist = thing.sendWhitelist || []
      thing.sendWhitelist.push flow.flowId

      @ThingService.updateDevice thing
    , (error)=>
      return deferred.reject error if error
      deferred.resolve thingsNeedingReceiveAs

    deferred

  addSendWhitelistsToFlow: () =>
    { thingsNeedingSendWhitelist, flow } = @scope
    return unless thingsNeedingSendWhitelist

    @ThingService.getThing(flow.flowId).
      then (thing)=>
        thing.sendWhitelist = thing.sendWhitelist || []
        thing.sendWhitelist = _.union thing.sendWhitelist, thingsNeedingSendWhitelist
        @ThingService.updateDevice thing

  prettifyType: (type) =>
    return unless type
    type = type.split(':')[1]
    type.replace('-', ' ')



angular.module('octobluApp').controller 'FlowConfigurePermissionsController', FlowConfigurePermissionsController
