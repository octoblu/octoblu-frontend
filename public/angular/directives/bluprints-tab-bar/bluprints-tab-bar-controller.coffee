class BluprintsTabBarController
  constructor: ($scope, APP_STORE_URL) ->
    @scope = $scope
    @scope.APP_STORE_URL = APP_STORE_URL

angular.module('octobluApp').controller 'BluprintsTabBarController', BluprintsTabBarController
