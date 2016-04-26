class OAuthProviderController
  constructor: ($scope, $stateParams, $window, OAUTH_PROVIDER, MeshbluDeviceService, ProfileService, AuthService) ->
    @window = $window
    @ProfileService = ProfileService
    @AuthService = AuthService
    @oauthUUID = $stateParams.uuid
    @OAUTH_PROVIDER = OAUTH_PROVIDER
    @stateParams = $stateParams

    $scope.loading = true
    MeshbluDeviceService.get(@oauthUUID).then (oauthDevice) =>
      oauthDevice ?= {}
      oauthDevice.options ?= {}
      oauthDevice.options.imageUrl ?= 'https://ds78apnml6was.cloudfront.net/device/oauth.svg'
      oauthDevice.options.description ?= 'No extended description provided.'
      $scope.oauthDevice = oauthDevice

    .finally =>
      $scope.loading = false

    @AuthService.getCurrentUser().then (user) =>
      $scope.currentUser = user

    $scope.authorize = @authorize
    $scope.cancel = @cancel

  authorize: =>
    @ProfileService.generateSessionToken(tag: @oauthUUID).then (session) =>
      {token,uuid} = session
      @window.location = "#{@OAUTH_PROVIDER}#{@stateParams.redirect}?response_type=#{@stateParams.response_type}&client_id=#{@oauthUUID}&redirect_uri=#{encodeURIComponent(@stateParams.redirect_uri)}&token=#{token}&uuid=#{uuid}&state=#{@stateParams.state}"

  cancel: =>
    url = @stateParams.cancel_uri || 'https://app.octoblu.com'
    @window.location = url

angular.module('octobluApp').controller 'OAuthProviderController', OAuthProviderController
