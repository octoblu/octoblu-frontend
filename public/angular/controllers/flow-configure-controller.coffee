class FlowConfigureController
  constructor: ($stateParams, $scope, $state, $timeout, $q, FlowService, FlowNodeTypeService, NodeRegistryService, NodeTypeService, ThingService, SERVICE_UUIDS) ->
    @q                   = $q
    @scope               = $scope
    @state               = $state
    @timeout             = $timeout
    @stateParams         = $stateParams
    @FlowService         = FlowService
    @ThingService        = ThingService
    @FlowNodeTypeService = FlowNodeTypeService
    @NodeTypeService     = NodeTypeService
    @NodeRegistryService = NodeRegistryService
    @SERVICE_UUIDS       = SERVICE_UUIDS

    @permissionsUpdated = false

    @FlowService.getFlow(@stateParams.flowId).
      then (flow) =>
        @scope.nodesToConfigure = @removeOperatorNodes flow.nodes
        @scope.flow = flow
        @scope.fragments = [{label: "Configure #{flow.name}"}]


        @setFlowNodeType _.first @scope.nodesToConfigure
        @checkPermissions()

  checkPermissions: =>
    { flow } = @scope
    { flowId, nodes } = flow

    @checkDevicePermission(flowId, nodes).then (thingsNeedingReceiveAs) =>
      @checkNodeRegistryPermissions(flowId, nodes).then (thingsNeedingSendWhitelist) =>
        return @permissionsUpdated = true unless thingsNeedingSendWhitelist || thingsNeedingReceiveAs
        @permissionsUpdated = false

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

  getNodeId: (node) =>
    @NodeTypeService.getNodeTypeByType(node.type).then (nodeType) =>
      nodeTypeId = '53c9b832f400e177dca325b3'
      nodeTypeId = nodeType._id if nodeType?._id
      params =
        nodeTypeId: nodeTypeId,
        wizard: true,
        designer: false,
        wizardFlowId: @scope.flow.flowId

      @state.go 'material.nodewizard-add', params

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

  checkButton: (position) =>
    return unless @scope.flow
    current = _.indexOf @scope.nodesToConfigure, @scope.flowNode
    return true if _.#{position}(@scope.nodesToConfigure) == @scope.nodesToConfigure[current]
    false

  checkForNextButton: () =>
    return unless @scope.flow
    current = _.indexOf @scope.nodesToConfigure, @scope.flowNode
    return true if _.last(@scope.nodesToConfigure) == @scope.nodesToConfigure[current]
    false

  checkForPrevButton: () =>
    return unless @scope.flow
    current = _.indexOf @scope.nodesToConfigure, @scope.flowNode
    return true if _.first(@scope.nodesToConfigure) == @scope.nodesToConfigure[current]
    false

  navigateNode: (position) =>
    current = _.indexOf @scope.nodesToConfigure, @scope.flowNode
    if position == 'next'
      return unless current < @scope.nodesToConfigure.length - 1
      @setFlowNodeType @scope.nodesToConfigure[current + 1]
    if position == 'prev'
      return unless current != _.first @scope.nodesToConfigure
      @setFlowNodeType @scope.nodesToConfigure[current - 1]

  setFlowNodeType: (node) =>
    @scope.showFlowNodeEditor = false
    @scope.flowNode = node

    return @scope.flowNodeType = null unless @scope.flowNode

    if @scope.flowNode.needsSetup
      @scope.flowNodeType = @scope.flowNode
      @scope.showFlowNodeEditor = true
      @firstOne = @checkForPrevButton()
      @finalOne = @checkForNextButton()
      return

    @FlowNodeTypeService.getFlowNodeType(@scope.flowNode.type).
      then (flowNodeType)=>
        @scope.flowNodeType = flowNodeType
        @firstOne = @checkForPrevButton()
        @finalOne = @checkForNextButton()
        @timeout( =>
          @scope.showFlowNodeEditor = true
        , 200)

    @FlowNodeTypeService.getOtherMatchingFlowNodeTypes(@scope.flowNode.type).
      then (otherMatchingFlowNodeTypes)=>
        @scope.otherMatchingFlowNodeTypes = otherMatchingFlowNodeTypes


angular.module('octobluApp').controller 'FlowConfigureController', FlowConfigureController
