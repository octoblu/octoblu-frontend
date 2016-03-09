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

    @scope.$watch 'permissions-updated', =>
      @permissionsUpdated = true

    @FlowService.getFlow(@stateParams.flowId).
      then (flow) =>
        @scope.nodesToConfigure = @removeDebugAndComment flow.nodes
        @addPermissionsNode @scope.nodesToConfigure
        @setSelectedNode _.first @scope.nodesToConfigure
        @scope.flow = flow
        @scope.fragments = [{label: "Configure #{flow.name}"}]

        @setFlowNodeType()

  addPermissionsNode: (nodes) =>
    permission =
      type: 'cats:Permissions'
      resourceType: 'flow-node'
    nodes.unshift permission
    nodes

  setSelectedNode: (node)=>
    @scope.flowNode = node
    @finalOne = @checkForNextButton()
    @setFlowNodeType()

  removeDebugAndComment: (nodes)=>
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

  emitUpdatePermissions: =>
    @scope.$broadcast 'update-permissions', null

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

    if flowNode.type == 'cats:Permissions'
      @scope.showFlowNodeEditor = true
      @scope.flowNodeType = flowNode

    @FlowNodeTypeService.getFlowNodeType(flowNode.type).
      then (flowNodeType)=>
        @scope.flowNodeType = flowNodeType
        @timeout( =>
          @scope.showFlowNodeEditor = true
        , 200)

    @FlowNodeTypeService.getOtherMatchingFlowNodeTypes(flowNode.type).
      then (otherMatchingFlowNodeTypes)=>
        @scope.otherMatchingFlowNodeTypes = otherMatchingFlowNodeTypes


angular.module('octobluApp').controller 'FlowConfigureController', FlowConfigureController
