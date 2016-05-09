class OAuthProviderController
  constructor: ($scope, $stateParams, $cookies, $window, OAUTH_PROVIDER, MeshbluDeviceService, AuthService, ThingService) ->
    @window = $window
    @cookies = $cookies
    @AuthService = AuthService
    @ThingService = ThingService
    @oauthUUID = $stateParams.uuid
    @OAUTH_PROVIDER = OAUTH_PROVIDER
    @stateParams = $stateParams

    $scope.loading = true
    MeshbluDeviceService.get(@oauthUUID).then (oauthDevice) =>
      oauthDevice ?= {}
      oauthDevice.options ?= {}
      oauthDevice.options.imageUrl ?= 'https://icons.octoblu.com/device/oauth.svg'
      oauthDevice.options.description ?= 'No extended description provided.'
      $scope.oauthDevice = oauthDevice

    .finally =>
      $scope.loading = false

    @AuthService.getCurrentUser().then (user) =>
      $scope.currentUser = user

    $scope.authorize = @authorize
    $scope.cancel = @cancel

  authorize: =>
    device   = uuid: @cookies.meshblu_auth_uuid
    metadata = tag: @oauthUUID

    @ThingService.generateSessionToken(device, metadata).then (session) =>
      {token,uuid} = session
      @window.location = "#{@OAUTH_PROVIDER}#{@stateParams.redirect}?response_type=#{@stateParams.response_type}&client_id=#{@oauthUUID}&redirect_uri=#{encodeURIComponent(@stateParams.redirect_uri)}&token=#{token}&uuid=#{uuid}&state=#{@stateParams.state}"
      
  cancel: =>
    url = @stateParams.cancel_uri || 'https://app.octoblu.com'
    @window.location = url

angular.module('octobluApp').controller 'OAuthProviderController', OAuthProviderController
