class FlowGridController
  constructor: ($scope, $state, FlowService, ThingService, NotifyService) ->
    @scope = $scope
    @state = $state
    @FlowService = FlowService
    @ThingService = ThingService
    @NotifyService = NotifyService
    @scope.isLoading = true

    @getFlows().then () => @scope.isLoading = false

  getFlows: () =>

    @FlowService.getAllFlows().then (flows) =>

      @ThingService.getThings({type: 'octoblu:flow'}).then (things) =>
        updatedFlows = _.map flows, (flow) =>
          flowDevice = _.find things, 'uuid': flow.flowId
          flow.online = flowDevice.online
          flow

        return @scope.flows = updatedFlows unless @scope.limit?
        @scope.flows = _.take updatedFlows, @scope.limit

  addFlow: () =>
    @FlowService.createFlow().then((newFlow) =>
      @state.go 'material.flow', flowId: newFlow.flowId
      @NotifyService.notify 'Flow Created'
    ).catch (error) ->
      console.error error



angular.module('octobluApp').controller 'FlowGridController', FlowGridController
