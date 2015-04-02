
class CreateFlowTutorialController
  constructor: ($cookies, $state, FlowService, FLOW_TUTORIAL_1) ->
    console.log('FlowService', FlowService)
    @state          = $state
    @FlowService    = FlowService
    @tutorial       = FLOW_TUTORIAL_1
    @createTutorialFlow().then (flow) =>
      @state.go 'material.flow', flowId: flow.flowId

  createTutorialFlow: =>
    console.log 'Create Tutorial Flow'
    emailID = '542ce2ad47a930b1280b0d05'
    flowAttributes =
      tutorial: @tutorial
      name: 'Tutorial Flow'
      nodes: []

    return @FlowService.createFlow(flowAttributes)


angular.module('octobluApp').controller 'CreateFlowTutorialController', CreateFlowTutorialController
