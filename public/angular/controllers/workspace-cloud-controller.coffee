class WorkspaceCloudController
  constructor: ($scope, $cookies, $location) ->
    @cookies = $cookies
    @location = $location
    @scope = $scope

    @cookies.workspaceCloud = true
    document.location = 'https://store.octoblu.com/cwc'

angular.module('octobluApp').controller 'WorkspaceCloudController', WorkspaceCloudController
