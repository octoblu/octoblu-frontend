class BluprintsTabBarController
  constructor: ($scope, AuthService, APP_STORE_URL) ->
    @scope = $scope
    @AuthService = AuthService

    @scope.APP_STORE_URL = APP_STORE_URL

    @AuthService.getCurrentUser()
      .then (user)=>
        @scope.APP_STORE_URL = "#{APP_STORE_URL}cwc" if user.userDevice.workspaceCloudUser

angular.module('octobluApp').controller 'BluprintsTabBarController', BluprintsTabBarController
