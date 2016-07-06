class FlowDetailEditorController
  constructor: ($state, localStorageService, BluprintService, FlowService, IS_IN_CWC_MODE) ->
    @iotAppFeatureEnabled = localStorageService.get('iotAppFeatureEnabled')
    @IS_IN_CWC_MODE = IS_IN_CWC_MODE
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
