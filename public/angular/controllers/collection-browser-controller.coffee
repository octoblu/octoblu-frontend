class CollectionBrowserController
  constructor: ($scope) ->
    @scope = $scope
    @scope.tab = {}

  toggleActiveTab: (tabState) =>
    @scope.tab.state = tabState if tabState in ['nodes', 'flows', 'debug']






angular.module('octobluApp').controller 'CollectionBrowserController', CollectionBrowserController
