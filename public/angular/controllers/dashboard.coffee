class DashboardController
  constructor: ($scope, $mdDialog, $mdToast, $state, $stateParams, AuthService, BluprintService, UrlService) ->

    $scope.isLoading = true

    $scope.refreshBluprints = ->
      BluprintService.getAllBluprints().then (bluprints) ->
        $scope.bluprints = bluprints
        console.log 'bluprints:', bluprints
        $scope.isLoading = false
    $scope.refreshBluprints()


    $scope.logoUrl = (node) ->
      types = type.split(':')
      iconType = types[0]
      iconName = types[1]
      return 'https://icons.octoblu.com/${iconType}/${iconName}.svg'



angular.module('octobluApp').controller 'DashboardController', DashboardController
