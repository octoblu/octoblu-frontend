class FlowPermissionManagerController
  constructor: ($q, $scope, $state, $http, ThingService, REGISTRY_URL) ->
    @scope        = $scope
    @q            = $q
    @ThingService = ThingService
    @REGISTRY_URL = REGISTRY_URL
    @http         = $http
    @loading      = true

    if localStorage.getItem 'octoblu.designer.sidebar.permissionsHide'
      @scope.hideSection = localStorage.getItem 'octoblu.designer.sidebar.permissionsHide'
    else
      @scope.hideSection = true

    @scope.$watchCollection 'flow.nodes', @renderPermissionManager
    @scope.$watch 'flow.pendingPermissions', @updateHideSection

  approveAll: =>
    @scope.flow.updatePendingPermissions()

  updateHideSection: (pendingPermissions) =>
    return unless pendingPermissions?
    console.log '!pendingPermissions', !pendingPermissions
    localStorage.setItem 'octoblu.designer.sidebar.permissionsHide', !pendingPermissions
    @scope.hideSection = !pendingPermissions

  renderPermissionManager: (nodes) =>
    return unless nodes?
    @scope.flow.getDevicesNeedingPermissions()
      .then =>
        @loading = false
        @scope.hideSection = !@scope.flow.pendingPermissions

angular.module('octobluApp').controller 'FlowPermissionManagerController', FlowPermissionManagerController
