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

    @permissionsUpdated = false

    @FlowService.getFlow(@stateParams.flowId).
      then (flow) =>
        @scope.nodesToConfigure = @removeOperatorNodes flow.nodes
        @setSelectedNode _.first @scope.nodesToConfigure
        @scope.flow = flow
        console.log "FLOW IS", flow
        @scope.fragments = [{label: "Configure #{flow.name}"}]

        @setFlowNodeType()
        @checkPermissions()

  checkPermissions: =>
    { flow } = @scope
    { flowId, nodes } = flow

    @checkDevicePermission(flowId, nodes).then (thingsNeedingReceiveAs) =>
      @checkNodeRegistryPermissions(flowId, nodes).then (thingsNeedingSendWhitelist) =>
        return @permissionsUpdated = true unless thingsNeedingSendWhitelist || thingsNeedingReceiveAs
        @permissionsUpdated = false

        console.log "permissions", thingsNeedingSendWhitelist, thingsNeedingReceiveAs

        @scope.thingsNeedingSendWhitelist = thingsNeedingSendWhitelist
        @scope.thingsNeedingReceiveAs = thingsNeedingReceiveAs
        @updatePermissions()

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

  getNodeId: () =>
    @NodeTypeService.getNodeTypeByType(@activeFlow.selectedFlowNode.type).then (nodeType) =>
      nodeTypeId = '53c9b832f400e177dca325b3'
      nodeTypeId = nodeType._id if nodeType?._id
      @state.go 'material.nodewizard-add', nodeTypeId: nodeTypeId, wizard: true

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
      console.log "In addFlowToWhitelists", thing
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
        console.log "In addSendWhitelistsToFlow", thing
        @ThingService.updateDevice thing

  setSelectedNode: (node)=>
    @scope.flowNode = node
    @finalOne = @checkForNextButton()
    @setFlowNodeType()

  removeOperatorNodes: (nodes)=>
    _.filter nodes, (node) =>
      return false unless node.type.split(':')[0] != 'operation'
      true

  saveFlow: =>
    { flow } = @scope
    @FlowService.saveFlow(flow).
      then ()=>
        @FlowService.start(flow).
        then ()=>
          @state.go 'material.flow', flowId: flow.flowId

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
    { flowNode } = @scope

    return @scope.flowNodeType = null unless flowNode

    @FlowNodeTypeService.getFlowNodeType(flowNode.type).
      then (flowNodeType)=>
        console.log "flowNodeType is", flowNodeType
        @scope.flowNodeType = flowNodeType
        @timeout( =>
          @scope.showFlowNodeEditor = true
        , 200)

    @FlowNodeTypeService.getOtherMatchingFlowNodeTypes(flowNode.type).
      then (otherMatchingFlowNodeTypes)=>
        @scope.otherMatchingFlowNodeTypes = otherMatchingFlowNodeTypes


angular.module('octobluApp').controller 'FlowConfigureController', FlowConfigureController
