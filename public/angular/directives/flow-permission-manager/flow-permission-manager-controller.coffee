class FlowPermissionManagerController
  constructor: ($q, $scope, $state, $http, ThingService, FlowPermissionService, REGISTRY_URL) ->
    @scope        = $scope
    @q            = $q
    @ThingService = ThingService
    @FlowPermissionService = FlowPermissionService
    @REGISTRY_URL = REGISTRY_URL
    @http         = $http
    @loading      = true
    @scope.hideSection = true
    @scope.$watchCollection 'flow.nodes', @renderPermissionManager
    @scope.$watch 'flow.pendingPermissions', @updateHideSection

  approveAll: =>
    @FlowPermissionService.createPermissionManager(@scope.flow).updatePendingPermissions()

  updateHideSection: (pendingPermissions) =>
    return unless pendingPermissions?
    @scope.hideSection = !pendingPermissions

  renderPermissionManager: (nodes) =>
    return unless nodes?
    permissionManager = @FlowPermissionService.createPermissionManager @scope.flow
    permissionManager.getDevicesNeedingPermissions()
      .then =>
        @loading = false
        @scope.hideSection = !@scope.flow.pendingPermissions

angular.module('octobluApp').controller 'FlowPermissionManagerController', FlowPermissionManagerController
