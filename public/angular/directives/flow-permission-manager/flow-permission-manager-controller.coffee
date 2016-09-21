class FlowPermissionManagerController
  constructor: ($q, $scope, $state, $http, ThingService, FlowPermissionService, REGISTRY_URL) ->
    @scope        = $scope
    @q            = $q
    @ThingService = ThingService
    @FlowPermissionService = FlowPermissionService
    @REGISTRY_URL = REGISTRY_URL
    @loading      = true
    @scope.hideSection = true
    @renderPermissionManager = _.throttle @renderPermissionManagerImmediately, 1000
    @scope.$watch 'flow.nodes', @renderPermissionManager, true
    @scope.$watch 'flow.pendingPermissions', @updateHideSection

  approveAll: =>
    @FlowPermissionService.createPermissionManager(@scope.flow).updatePendingPermissions()

  updateHideSection: (pendingPermissions) =>
    return unless pendingPermissions?
    @scope.hideSection = !pendingPermissions

  renderPermissionManagerImmediately: (nodes) =>
    return unless nodes?
    permissionManager = @FlowPermissionService.createPermissionManager @scope.flow
    permissionManager.getDevicesNeedingPermissions()
      .then =>
        @loading = false
        @scope.hideSection = !@scope.flow.pendingPermissions

angular.module('octobluApp').controller 'FlowPermissionManagerController', FlowPermissionManagerController
