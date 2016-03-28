class FlowGridController
  constructor: ($scope, FlowService, ThingService) ->
    @scope = $scope
    @FlowService = FlowService
    @ThingService = ThingService
    @scope.isLoading = false

    @getFlows()

  getFlows: () =>
    @scope.isLoading = true

    @FlowService.getAllFlows().then (flows) =>
      @scope.isLoading = false

      @ThingService.getThings({type: 'octoblu:flow'}).then (things) =>
        updatedFlows = _.map flows, (flow) =>
          flowDevice = _.find things, 'uuid': flow.flowId
          flow.online = flowDevice.online
          flow

        return @scope.flows = updatedFlows unless @scope.limit?
        @scope.flows = _.take updatedFlows, @scope.limit



  #  @scope.reMap: (nodes) =>
  #    array = []
  #    _.forEach nodes, (node) ->
  #      array.push(node.type) if (node.type.indexOf("operation") == -1 && _.indexOf(array, node.type) == -1)
  #    return array
   #
   #
   #
  #  @scope.logoUrl: (nodes) =>
  #    array = []
  #    _.forEach nodes, (node) ->
  #      types = node.split(':')
  #      iconType = types[0]
  #      iconName = types[1]
  #      array.push(('https://icons.octoblu.com/' + iconType + '/' + iconName + '.svg'))
  #    return array
  #   _.forEach @scope.flows, (flow, key) ->
  #     @scope.flows[key].iconUrls = @scope.logoUrl(@scope.reMap(flow.nodes))

    #
    # $scope.isLoading = true
    #
    # $scope.refreshBluprints = ->
    #
    #
    # $scope.addFlow = ->
    #   FlowService.createFlow().then((newFlow) ->
    #     $state.go 'material.flow', flowId: newFlow.flowId
    #     NotifyService.notify 'Flow Created'
    #   ).catch (error) ->
    #     console.error error
    #
    #



angular.module('octobluApp').controller 'FlowGridController', FlowGridController
