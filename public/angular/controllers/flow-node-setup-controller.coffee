class FlowNodeSetupController
  constructor: ($scope, $state, FlowService, FlowEditorService, NodeTypeService, OCTOBLU_ICON_URL) ->
    @scope             = $scope
    @state             = $state
    @FlowService       = FlowService
    @NodeTypeService   = NodeTypeService
    @FlowEditorService = FlowEditorService
    @OCTOBLU_ICON_URL  = OCTOBLU_ICON_URL

    @activeFlow = @FlowService.getActiveFlow()

  logoUrl: () =>
    return @scope.nodeType.logo if @scope.nodeType.logo
    return @scope.nodeType.logo = "#{@OCTOBLU_ICON_URL}node/other.svg" unless @scope.nodeType && @scope.nodeType.type

    type = @scope.nodeType.type.replace 'octoblu:', 'node:'
    type = type.replace(':', '/')
    "#{@OCTOBLU_ICON_URL}#{type}.svg"

  getNodeId: () =>
    @NodeTypeService.getNodeTypeByType(@scope.nodeType.type).then (nodeType) =>
      @state.go 'material.nodewizard-add', nodeTypeId: nodeType._id, designer: true

  showDelete: () =>
    @activeFlow.selectedFlowNode.needsConfiguration

  deleteNode: () =>
    newActiveFlow = @FlowEditorService.deleteSelection @activeFlow
    @activeFlow = newActiveFlow
    @FlowService.saveActiveFlow @activeFlow


angular.module('octobluApp').controller 'FlowNodeSetupController', FlowNodeSetupController
