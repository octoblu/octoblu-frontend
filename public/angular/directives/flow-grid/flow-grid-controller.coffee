class FlowGridController
  constructor: ($scope, $state, FlowService, ThingService, NotifyService) ->
    @scope = $scope
    @state = $state
    @FlowService = FlowService
    @ThingService = ThingService
    @NotifyService = NotifyService
    @scope.isLoading = true

    @getFlows()
      .then () =>
        @scope.isLoading = false
        @getFlowStatus @scope.flows

  getFlows: () =>
    @FlowService.getAllFlows().then (flows) =>
      flows.reverse()
      return @scope.flows = flows unless @scope.limit?
      @scope.flows = _.take flows, @scope.limit

  getFlowStatus: (flows) =>
    @ThingService.getThings({type: 'octoblu:flow'}).then (things) =>
      updatedFlows = _.map flows, (flow) =>
        flowDevice = _.find things, 'uuid': flow.flowId
        flow.online = flowDevice.online
        flow
      @scope.flows = updatedFlows

  addFlow: () =>
    @FlowService.createFlow().then((newFlow) =>
      @state.go 'material.flow', flowId: newFlow.flowId
      @NotifyService.notify 'Flow Created'
    ).catch (error) ->
      console.error error



angular.module('octobluApp').controller 'FlowGridController', FlowGridController
