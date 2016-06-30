class FlowGridController
  constructor: ($scope, $state, FlowService, ThingService, NotifyService) ->
    @scope = $scope
    @state = $state
    @FlowService = FlowService
    @ThingService = ThingService
    @NotifyService = NotifyService
    @scope.isLoading = true
    @projection =
      uuid: true
      online: true
      name:true
      'draft.description': true
      'draft.nodes.category': true
      'draft.nodes.type': true

    @fetchFlows()
      .then () =>
        @scope.isLoading = false
        @getFlowStatus @scope.flows

  fetchFlows: () =>
    return @allFlows() unless @scope.limit?
    @someFlows()

  allFlows: () =>
    @ThingService.getThings({type: 'octoblu:flow'}, @projection).then (flows) =>
      flows.reverse()
      @scope.flows = flows

  someFlows: () =>
    @ThingService.getThings({type: 'octoblu:flow'}, @projection).then (flows) =>
      @scope.flows = _.slice flows, 0, @scope.limit

  getFlowStatus: (flows) =>
    @ThingService.getThings({type: 'octoblu:flow'}, {uuid: true, online: true}).then (things) =>
      updatedFlows = _.map flows, (flow) =>
        flowDevice = _.find things, 'uuid': flow.uuid
        flow.online = flowDevice?.online if flowDevice?.online?
        flow
      @scope.flows = updatedFlows

  addFlow: () =>
    @FlowService.createFlow().then((newFlow) =>
      @state.go 'material.flow', flowId: newFlow.flowId
      @NotifyService.notify 'Flow Created'
    ).catch (error) ->
      console.error error

angular.module('octobluApp').controller 'FlowGridController', FlowGridController
