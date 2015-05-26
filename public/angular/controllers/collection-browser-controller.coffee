class CollectionBrowserController
  constructor: ($scope) ->
    @scope = $scope
    @scope.tab = {}
    @toggleActiveTab 'nodes'

  toggleActiveTab: (tabState) =>
    @scope.tab.state =
      if tabState in ['nodes', 'flows', 'debug']
        tabState
      else
        undefined






angular.module('octobluApp').controller 'CollectionBrowserController', CollectionBrowserController
