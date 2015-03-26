class OAuthProviderController
  constructor: ($scope, $stateParams, $window, OAUTH_PROVIDER, MeshbluDeviceService, ProfileService) ->
    @window = $window
    @ProfileService = ProfileService
    @oauthUUID = $stateParams.uuid
    @OAUTH_PROVIDER = OAUTH_PROVIDER

    $scope.loading = true
    MeshbluDeviceService.get(@oauthUUID).then (oauthDevice) =>
      $scope.oauthDevice = oauthDevice
    .finally =>
      $scope.loading = false

    $scope.authorize = @authorize

  authorize: =>
    @ProfileService.generateSessionToken().then (session) =>
      {token,uuid} = session
      @window.location = "#{@OAUTH_PROVIDER}/#{@oauthUUID}?token=#{token}&uuid=#{uuid}"

angular.module('octobluApp').controller 'OAuthProviderController', OAuthProviderController
