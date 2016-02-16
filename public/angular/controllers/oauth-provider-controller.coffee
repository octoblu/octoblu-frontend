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
      $scope.oauthDevice = oauthDevice
    .finally =>
      $scope.loading = false

    @AuthService.getCurrentUser().then (user) =>
      $scope.currentUser = user

    $scope.authorize = @authorize
    $scope.unAuthorize = @unAuthorize

  authorize: =>
    @ProfileService.generateSessionToken().then (session) =>
      {token,uuid} = session
      @window.location = "#{@OAUTH_PROVIDER}#{@stateParams.redirect}?response_type=#{@stateParams.response_type}&client_id=#{@oauthUUID}&redirect_uri=#{encodeURIComponent(@stateParams.redirect_uri)}&token=#{token}&uuid=#{uuid}&state=#{@stateParams.state}"

  unAuthorize: =>
    @AuthService.logout().then =>
      @window.location =  "/login?callbackUrl=#{encodeURIComponent(@window.location)}"

angular.module('octobluApp').controller 'OAuthProviderController', OAuthProviderController
