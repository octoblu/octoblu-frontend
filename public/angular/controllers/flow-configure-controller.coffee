class FlowConfigureController
  constructor: ($stateParams, $scope, $state, $cookies, $timeout, $q, FlowService, FlowNodeTypeService, NodeRegistryService, NodeTypeService, ThingService, SERVICE_UUIDS) ->
    @q                   = $q
    @scope               = $scope
    @state               = $state
    @cookies             = $cookies
    @timeout             = $timeout
    @stateParams         = $stateParams
    @FlowService         = FlowService
    @ThingService        = ThingService
    @FlowNodeTypeService = FlowNodeTypeService
    @NodeTypeService     = NodeTypeService
    @NodeRegistryService = NodeRegistryService
    @SERVICE_UUIDS       = SERVICE_UUIDS

    @clearLocalStorage()
    @permissionsUpdated = false

    @FlowService.getFlow(@stateParams.flowId).
      then (flow) =>
        @scope.nodesToConfigure = @removeOperatorNodes flow.nodes
        @scope.flow = flow
        @scope.fragments = [{label: "Configure #{flow.name}"}]

        @nodeIndex = @stateParams.nodeIndex

        @setFlowNodeType @scope.nodesToConfigure[@nodeIndex]
        @checkPermissions()

  clearLocalStorage: =>
    return unless localStorage.getItem 'redirectFlowConfig'
    localStorage.removeItem 'wizardFlowId'
    localStorage.removeItem 'wizardNodeIndex'
    localStorage.removeItem 'redirectFlowConfig'

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
        wizardNodeIndex: @getCurrent()

      @setRedirectUriConfig()

      @state.go 'material.nodewizard-add', params

  setRedirectUriConfig: () =>
    localStorage.setItem 'wizardFlowId', @scope.flow.flowId
    localStorage.setItem 'wizardNodeIndex', @getCurrent()
    localStorage.setItem 'redirectFlowConfig', true

  addFlowToWhitelists: () =>
    { thingsNeedingReceiveAs, flow } = @scope
    deferred = @q.defer()

    return unless thingsNeedingReceiveAs
    async.eachSeries thingsNeedingReceiveAs, ((thing, callback) =>
      updateObj = {}
      updateObj.uuid = thing.uuid
      updateObj.receiveAsWhitelist = thing.receiveAsWhitelist or []
      updateObj.receiveAsWhitelist.push flow.flowId
      updateObj.receiveWhitelist = thing.receiveWhitelist or []
      updateObj.receiveWhitelist.push flow.flowId
      updateObj.sendWhitelist = thing.sendWhitelist or []
      updateObj.sendWhitelist.push flow.flowId
      @ThingService.updateDevice(updateObj).then( ->
        callback()
        return
      ).catch callback
      return
    ), (error) ->
      return deferred.reject(error) if error
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

  checkForNextButton: (current) =>
    return unless @scope.flow
    return true if _.last(@scope.nodesToConfigure) == @scope.nodesToConfigure[current]
    false

  checkForPrevButton: (current) =>
    return unless @scope.flow
    return true if _.first(@scope.nodesToConfigure) == @scope.nodesToConfigure[current]
    false

  getCurrent: () =>
    return _.indexOf @scope.nodesToConfigure, @scope.flowNode

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

    @firstOne = @checkForPrevButton(@getCurrent())
    @finalOne = @checkForNextButton(@getCurrent())

    if @scope.flowNode.needsSetup
      @scope.flowNodeType = @scope.flowNode
      @scope.showFlowNodeEditor = true
      return

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
