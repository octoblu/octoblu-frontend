class WorkspaceCloudController
  constructor: ($scope, $cookies, $state, $window) ->
    @cookies = $cookies
    @state   = $state
    @scope   = $scope

    $window.location = 'https://cwc-store.octoblu.com'
    # @cookies.workspaceCloud = true
    # @state.go 'login'

angular.module('octobluApp').controller 'WorkspaceCloudController', WorkspaceCloudController
