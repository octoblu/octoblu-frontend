class ConfigureController
  constructor: ($scope, $state, $stateParams, NodeService, OCTOBLU_ICON_URL) ->
    @scope = $scope
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL

    @scope.activeTab = $stateParams.tab || 'all'
    @scope.loading = true

    NodeService.getNodes().then (devices) =>
      @scope.loading = false
      @scope.devices = devices

    @scope.$watch 'activeTab', (newTab) =>
      @setNodesForTab newTab

  filterChannels: (node) =>
    node.category == 'channel'

  filterFlows: (node) =>
    node.type == 'device:flow'

  filterDevicesAndMicroblu: (node) =>
    return false if node.type == 'device:flow'
    node.category == 'device' || node.category == 'microblu'

  setNodesForTab: (tab) =>
    @scope.categoryFilter = null if (tab == 'all')
    @scope.categoryFilter = @filterChannels if (tab == 'channels')
    @scope.categoryFilter = @filterDevicesAndMicroblu if (tab == 'devices')
    @scope.categoryFilter = @filterFlows if (tab == 'flows')


angular.module('octobluApp').controller 'ConfigureController', ConfigureController
