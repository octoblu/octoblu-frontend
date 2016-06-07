class FlowDetailEditorController
  constructor: ($window, $state, IS_IN_CWC_MODE, BluprintService, FlowService, BLUPRINTER_URL) ->
    @window = $window
    @BLUPRINTER_URL = BLUPRINTER_URL
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

  createIotApp: (flow) =>
    @window.location = "#{@BLUPRINTER_URL}/flows/#{flow.flowId}/new"

  saveflow: (flow) =>
    @FlowService.saveFlow(flow)

angular.module('octobluApp').controller 'FlowDetailEditorController', FlowDetailEditorController
