class WorkspaceCloudController
  constructor: ($scope, $cookies, $state) ->
    @cookies = $cookies
    @state = $state
    @scope = $scope

    @cookies.workspaceCloud = true
    @state.go 'login'

angular.module('octobluApp').controller 'WorkspaceCloudController', WorkspaceCloudController
