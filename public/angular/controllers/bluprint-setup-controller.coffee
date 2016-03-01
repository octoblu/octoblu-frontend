class BluprintSetupController
  constructor: ($stateParams, $state, $scope, $q, FlowService, NodeRegistryService, ThingService, SERVICE_UUIDS) ->
    @q                   = $q
    @scope               = $scope
    @state               = $state
    @stateParams         = $stateParams
    @FlowService         = FlowService
    @ThingService        = ThingService
    @NodeRegistryService = NodeRegistryService
    @SERVICE_UUIDS       = SERVICE_UUIDS

    @FlowService.getFlow(@stateParams.flowId).
      then (flow) =>
        @scope.flow = flow
        @scope.fragments = [{label: "Setup #{flow.name}"}]

        @checkPermissions()

  checkPermissions: =>
    @permissionsLoading = true
    @checkDevicePermission(@scope.flow.flowId, @scope.flow.nodes).
      then (thingsNeedingReceiveAs)=>
        @checkNodeRegistryPermissions(@scope.flow.flowId, @scope.flow.nodes).
          then (thingsNeedingSendWhitelist)=>
            @permissionsLoading = false
            @permissionsUpdated = true unless thingsNeedingSendWhitelist || thingsNeedingReceiveAs

            @scope.thingsNeedingSendWhitelist = thingsNeedingSendWhitelist
            @scope.thingsNeedingReceiveAs = thingsNeedingReceiveAs

  checkDevicePermission: (flowId, nodes) =>
    deviceNodes = _.filter nodes, (node)=>
      node.meshblu || node.class == 'device-flow'

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

  saveFlow: =>
    { flow } = @scope
    @FlowService.saveFlow(flow).
      then ()=>
        @state.go 'material.flow', flowId: flow.flowId

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

angular.module('octobluApp').controller 'BluprintSetupController', BluprintSetupController
