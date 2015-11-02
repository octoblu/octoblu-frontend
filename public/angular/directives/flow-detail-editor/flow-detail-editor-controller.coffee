class FlowDetailEditorController
  constructor: ($cookies, $scope, $state, BluprintService, FlowService, NotifyService, AuthService) ->
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
        @state.go 'material.bluprintDetail', bluprintId: template.uuid, editMode: true

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

  saveflow: (flow) ->
    @FlowService.saveFlow(flow)

angular.module('octobluApp').controller 'FlowDetailEditorController', FlowDetailEditorController
