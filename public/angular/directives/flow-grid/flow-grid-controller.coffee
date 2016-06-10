class FlowGridController
  constructor: ($scope, $state, FlowService, ThingService, NotifyService) ->
    @scope = $scope
    @state = $state
    @FlowService = FlowService
    @ThingService = ThingService
    @NotifyService = NotifyService
    @scope.isLoading = true

    @fetchFlows()
      .then () =>
        @scope.isLoading = false
        @getFlowStatus @scope.flows

  fetchFlows: () =>
    return @allFlows() unless @scope.limit?
    @someFlows()

  allFlows: () =>
    @FlowService.getAllFlows().then (flows) =>
      flows.reverse()
      @scope.flows = flows

  someFlows: () =>
    @FlowService.getSomeFlows(@scope.limit).then (flows) =>
      @scope.flows = flows

  getFlowStatus: (flows) =>
    @ThingService.getThings({type: 'octoblu:flow'}, {uuid: true, online: true}).then (things) =>
      updatedFlows = _.map flows, (flow) =>
        flowDevice = _.find things, 'uuid': flow.flowId
        flow.online = flowDevice?.online
        flow
      @scope.flows = updatedFlows

  addFlow: () =>
    @FlowService.createFlow().then((newFlow) =>
      @state.go 'material.flow', flowId: newFlow.flowId
      @NotifyService.notify 'Flow Created'
    ).catch (error) ->
      console.error error

angular.module('octobluApp').controller 'FlowGridController', FlowGridController
