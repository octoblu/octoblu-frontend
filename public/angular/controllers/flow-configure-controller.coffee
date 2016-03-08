class FlowConfigureController
  constructor: ($stateParams, $scope, $state, $timeout, $q, FlowService, FlowNodeTypeService, NodeRegistryService, ThingService, SERVICE_UUIDS) ->
    @q                   = $q
    @scope               = $scope
    @state               = $state
    @timeout             = $timeout
    @stateParams         = $stateParams
    @FlowService         = FlowService
    @ThingService        = ThingService
    @FlowNodeTypeService = FlowNodeTypeService
    @NodeRegistryService = NodeRegistryService
    @SERVICE_UUIDS       = SERVICE_UUIDS

    @permissionsUpdated  = true
    @permissionsLoading = true

    @FlowService.getFlow(@stateParams.flowId).
      then (flow) =>
        @scope.nodesToConfigure = @removeDebugAndComment flow.nodes
        @setSelectedNode _.first @scope.nodesToConfigure
        @scope.flow = flow
        @scope.fragments = [{label: "Configure #{flow.name}"}]

        @checkPermissions()
        @setFlowNodeType()

  setSelectedNode: (node)=>
    @scope.flowNode = node
    @finalOne = @checkForNextButton()
    @setFlowNodeType()

  removeDebugAndComment: (nodes)=>
    _.filter nodes, (node) =>
      return false unless node.type != 'operation:comment'
      return false unless node.type != 'operation:debug'
      true

  checkPermissions: =>
    @checkDevicePermission(@scope.flow.flowId, @scope.flow.nodes).
      then (thingsNeedingReceiveAs)=>
        @checkNodeRegistryPermissions(@scope.flow.flowId, @scope.flow.nodes).
          then (thingsNeedingSendWhitelist)=>
            @permissionsLoading = false

            @permissionsUpdated = false
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
        @FlowService.start(flow).
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

  prettifyType: (type) =>
    return unless type
    type = type.split(':')[1]
    type.replace('-', ' ')

  checkForNextButton: =>
    return unless @scope.flow
    current = _.indexOf @scope.nodesToConfigure, @scope.flowNode
    return true if _.last(@scope.nodesToConfigure) == @scope.nodesToConfigure[current]
    false

  nextNode: =>
    current = _.indexOf @scope.nodesToConfigure, @scope.flowNode
    return unless current < @scope.nodesToConfigure.length - 1
    @setSelectedNode @scope.nodesToConfigure[current+1]

  setFlowNodeType: =>
    @scope.showFlowNodeEditor = false
    return @scope.flowNodeType = null unless @scope.flowNode

    @FlowNodeTypeService.getFlowNodeType(@scope.flowNode.type).
      then (flowNodeType)=>
        @scope.flowNodeType = flowNodeType
        @timeout( =>
          @scope.showFlowNodeEditor = true
        , 200)

    @FlowNodeTypeService.getOtherMatchingFlowNodeTypes(@scope.flowNode.type).
      then (otherMatchingFlowNodeTypes)=>
        @scope.otherMatchingFlowNodeTypes = otherMatchingFlowNodeTypes


angular.module('octobluApp').controller 'FlowConfigureController', FlowConfigureController
