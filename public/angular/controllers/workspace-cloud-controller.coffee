class WorkspaceCloudController
  constructor: ($scope, $cookies, $location) ->
    @cookies = $cookies
    @location = $location
    @scope = $scope

    @cookies.workspaceCloud = true

angular.module('octobluApp').controller 'WorkspaceCloudController', WorkspaceCloudController
