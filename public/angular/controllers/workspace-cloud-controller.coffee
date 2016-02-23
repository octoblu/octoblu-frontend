class WorkspaceCloudController
  constructor: ($scope, $cookies, $state) ->
    @cookies = $cookies
    @state = $state
    @scope = $scope

    @cookies.workspaceCloud = true
    callbackUrl = 'https://store.octoblu.com/cwc'
    @state.go 'login', { callbackUrl: callbackUrl }

angular.module('octobluApp').controller 'WorkspaceCloudController', WorkspaceCloudController
