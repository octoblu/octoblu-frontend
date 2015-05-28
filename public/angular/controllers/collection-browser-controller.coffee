class CollectionBrowserController
  constructor: ($scope, FlowNodeTypeService) ->
    @scope = $scope
    @scope.tab = {}
    @FlowNodeTypeService = FlowNodeTypeService
    @toggleActiveTab 'nodes'

    @FlowNodeTypeService.getFlowNodeTypes()
      .then (flowNodeTypes) =>
        @scope.operatorNodes = _.findWhere 
        @scope.flowCollection = _.findWhere flowNodeTypes, type: 'device:flow'
      .catch (error) =>
        console.error 'Error', error.message
        @scope.errorMessage = error.message


  toggleActiveTab: (tabState) =>
    @scope.tab.state =
      if tabState in ['nodes', 'flows', 'debug']
        tabState
      else
        undefined






angular.module('octobluApp').controller 'CollectionBrowserController', CollectionBrowserController
