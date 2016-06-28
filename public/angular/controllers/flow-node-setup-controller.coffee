class FlowNodeSetupController
  constructor: ($scope, $state, FlowService, RegistryService, FlowEditorService, NodeTypeService, DeviceLogo) ->
    @scope             = $scope
    @state             = $state
    @FlowService       = FlowService
    @NodeTypeService   = NodeTypeService
    @FlowEditorService = FlowEditorService
    @DeviceLogo        = DeviceLogo
    @activeFlow        = @FlowService.getActiveFlow()
    @deprecated        = @activeFlow.selectedFlowNode.deprecated
    @registryItem      = RegistryService.getItem(@activeFlow.selectedFlowNode)
    @hasNewAlternative = !!@registryItem

  logoUrl: =>
    new @DeviceLogo(@activeFlow.selectedFlowNode).get()

  setupDeprecated: =>
    @NodeTypeService.getNodeTypeByType(@activeFlow.selectedFlowNode.type).then (nodeType) =>
      nodeTypeId = '53c9b832f400e177dca325b3'
      nodeTypeId = nodeType._id if nodeType?._id
      @state.go 'material.nodewizard-add', nodeTypeId: nodeTypeId, designer: true

  setup: =>
    return window.location=@registryItem.createUri if @registryItem.createUri?
    @NodeTypeService.getNodeTypeByType(@activeFlow.selectedFlowNode.type).then (nodeType) =>
      nodeTypeId = '53c9b832f400e177dca325b3'
      nodeTypeId = nodeType._id if nodeType?._id
      @state.go 'material.nodewizard-add', nodeTypeId: nodeTypeId, designer: true

  showDelete: =>
    @activeFlow.selectedFlowNode.needsConfiguration

  deleteNode: =>
    newActiveFlow = @FlowEditorService.deleteSelection @activeFlow
    @activeFlow = newActiveFlow
    @FlowService.saveActiveFlow @activeFlow

angular.module('octobluApp').controller 'FlowNodeSetupController', FlowNodeSetupController
