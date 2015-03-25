class OAuthProviderController
  constructor: ($scope, $stateParams, MeshbluDeviceService, ProfileService) ->
    @ProfileService = ProfileService

    MeshbluDeviceService.get($stateParams.uuid).then (oauthDevice) ->
      $scope.oauthDevice = oauthDevice

  authorize: =>
    @ProfileService.generateSessionToken()

angular.module('octobluApp').controller 'OAuthProviderController', OAuthProviderController
