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
        @state.go 'material.bluprintEdit', bluprintId: template.uuid, createMode: true

  saveflow: (flow) ->
    @FlowService.saveFlow(flow)

angular.module('octobluApp').controller 'FlowDetailEditorController', FlowDetailEditorController
