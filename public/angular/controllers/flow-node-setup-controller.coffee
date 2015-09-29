class FlowNodeSetupController
  constructor: ($scope, FlowService, FlowEditorService) ->
    @scope             = $scope
    @FlowService       = FlowService
    @FlowEditorService = FlowEditorService

    @activeFlow = @FlowService.getActiveFlow()

  showDelete: () =>
    @activeFlow.selectedFlowNode.needsConfiguration

  deleteNode: () =>
    newActiveFlow = @FlowEditorService.deleteSelection @activeFlow
    @activeFlow = newActiveFlow
    @FlowService.saveActiveFlow @activeFlow


angular.module('octobluApp').controller 'FlowNodeSetupController', FlowNodeSetupController
