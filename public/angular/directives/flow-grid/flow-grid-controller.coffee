class FlowGridController
  constructor: ($scope, FlowService) ->
    @scope = $scope
    @FlowService = FlowService
    @scope.isLoading = false

    @getFlows()

  getFlows: () =>
    @scope.isLoading = true

    @FlowService.getAllFlows().then (flows) =>
      console.log flows
      @scope.isLoading = false
      @scope.flows = flows
        
      # console.log flows
      # _.forEach $scope.flows, (flow, key) ->
      #   $scope.flows[key].iconUrls = $scope.logoUrl($scope.reMap(flow.nodes))
      #
      # console.log 'flows:', $scope.flows

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
    # $scope.reMap = (nodes) ->
    #   array = []
    #   _.forEach nodes, (node) ->
    #     array.push(node.type) if (node.type.indexOf("operation") == -1 && _.indexOf(array, node.type) == -1)
    #   return array
    #
    # $scope.refreshBluprints()
    #
    # $scope.logoUrl = (nodes) ->
    #   array = []
    #   _.forEach nodes, (node) ->
    #     types = node.split(':')
    #     iconType = types[0]
    #     iconName = types[1]
    #     array.push(('https://icons.octoblu.com/' + iconType + '/' + iconName + '.svg'))
    #   return array



angular.module('octobluApp').controller 'FlowGridController', FlowGridController
