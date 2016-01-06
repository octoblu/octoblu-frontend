class WorkspaceCloudController
  constructor: ($scope, $cookies) ->
    @scope = $scope
    @cookies = $cookies
    @setCookie()

  setCookie: () =>
    @cookies.workspaceCloud = true


angular.module('octobluApp').controller 'WorkspaceCloudController', WorkspaceCloudController
