class BluprintSetupController
  constructor: ($stateParams, $state, $scope, FlowService) ->
    @scope = $scope
    @state = $state
    @stateParams = $stateParams
    @FlowService = FlowService

    @FlowService.getFlow(@stateParams.flowId).
      then (flow) =>
        @scope.flow = flow
        @scope.fragments = [{label: "Setup #{flow.name}"}]

  saveFlow: =>
    { flow } = @scope
    @FlowService.saveFlow(flow).
      then ()=>
        @state.go 'material.flow', flowId: flow.flowId

angular.module('octobluApp').controller 'BluprintSetupController', BluprintSetupController
