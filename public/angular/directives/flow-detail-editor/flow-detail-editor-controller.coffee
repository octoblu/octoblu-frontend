class FlowDetailEditorController
  constructor: ($cookies, $scope, $state, BluprintService, FlowService, NotifyService) ->
    @cookies = $cookies
    @scope = $scope
    @state = $state
    @BluprintService = BluprintService
    @FlowService = FlowService
    @NotifyService = NotifyService

  createBluprint: (flow) ->
    @BluprintService
      .createBluprint
        name: flow.name
        flowId: flow.flowId
      .then (template) =>
        @state.go 'material.bluprint', templateId: template.uuid

  deleteFlow: (flow) ->
    @NotifyService
      .confirm
        title: 'Delete Flow'
        content: 'Are you sure you want to delete ' + flow.name + '?'
      .then =>
        delete @cookies.currentFlowId
        @FlowService.deleteFlow(flow.flowId)
          .then =>
            @state.go 'material.design'

angular.module('octobluApp').controller 'FlowDetailEditorController', FlowDetailEditorController
