class ConfigureController
  constructor: ($scope, $state, $stateParams, NodeService, OCTOBLU_ICON_URL) ->
    @scope = $scope
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL
    @scope.loading = true

    @scope.deviceCategories = ["channel", "device", "microblu"]

    NodeService.getNodes().then (devices) =>
      @scope.loading = false
      @scope.devices = devices


angular.module('octobluApp').controller 'ConfigureController', ConfigureController
