class FlowPermissionManagerController
  constructor: ($q, $scope, $state, $http, ThingService, REGISTRY_URL) ->
    @scope        = $scope
    @q            = $q
    @ThingService = ThingService
    @REGISTRY_URL = REGISTRY_URL
    @http         = $http
    @loading      = true
    @scope.hideSection = true
    @scope.$watchCollection 'flow.nodes', @renderPermissionManager

  approveAll: =>
    @scope.flow.updatePendingPermissions()

  renderPermissionManager: (nodes) =>
    return unless nodes?
    return unless @scope.flow?
    @scope.flow.getDevicesNeedingPermissions()
      .then =>
        @loading = false
        @scope.hideSection = !@scope.flow.pendingPermissions

angular.module('octobluApp').controller 'FlowPermissionManagerController', FlowPermissionManagerController
