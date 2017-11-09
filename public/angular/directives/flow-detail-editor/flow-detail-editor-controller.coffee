class FlowDetailEditorController
  constructor: ($state, localStorageService, BluprintService, FlowService) ->
    @iotAppFeatureEnabled = localStorageService.get('iotAppFeatureEnabled')
    @state = $state
    @BluprintService = BluprintService
    @FlowService = FlowService

  createBluprint: (flow) =>
    @BluprintService
      .createBluprint
        name: flow.name
        flowId: flow.flowId
      .then (template) =>
        @state.go 'material.bluprintEdit', bluprintId: template.uuid, createMode: true

  saveflow: (flow) =>
    @FlowService.saveFlow(flow)

angular.module('octobluApp').controller 'FlowDetailEditorController', FlowDetailEditorController
