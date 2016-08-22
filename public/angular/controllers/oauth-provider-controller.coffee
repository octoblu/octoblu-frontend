class OAuthProviderController
  constructor: ($scope, $stateParams, $cookies, $q, $window, OAUTH_PROVIDER, MeshbluDeviceService, AuthService, ThingService, MeshbluHttpService) ->
    @window = $window
    @cookies = $cookies
    @AuthService = AuthService
    @ThingService = ThingService
    @oauthUUID = $stateParams.uuid
    @OAUTH_PROVIDER = OAUTH_PROVIDER
    @stateParams = $stateParams
    @q = $q

    $scope.loading = true
    MeshbluDeviceService.get(@oauthUUID).then (oauthDevice) =>
      oauthDevice ?= {}
      oauthDevice.options ?= {}
      oauthDevice.options.imageUrl ?= 'https://icons.octoblu.com/device/oauth.svg'
      oauthDevice.options.description ?= ''
      $scope.oauthDevice = oauthDevice
    .then =>
      @AuthService.getCurrentUser().then (user) =>
        $scope.currentUser = user
    .then =>
      @q (resolve, reject) =>
        MeshbluHttpService.device @cookies.meshblu_auth_uuid, (error, userDevice) =>
          return reject error if error?
          $scope.userDevice = userDevice
          resolve userDevice
    .then (userDevice) =>
      @q (resolve, reject) =>
        query = 'metadata.client_id': @oauthUUID
        MeshbluHttpService.searchTokens {query}, (error, tokens) =>
          return reject error if error?
          console.log {tokens}

          return @authorize() unless _.isEmpty tokens
          $scope.loading = false

    $scope.authorize = @authorize
    $scope.cancel = @cancel

  authorize: =>
    device   = uuid: @cookies.meshblu_auth_uuid
    metadata =
      tag: "oauth-exchange-#{@oauthUUID}"

    @ThingService.generateSessionToken(device, metadata).then (session) =>
      {token,uuid} = session
      @window.location = "#{@OAUTH_PROVIDER}#{@stateParams.redirect}?response_type=#{@stateParams.response_type}&client_id=#{@oauthUUID}&redirect_uri=#{encodeURIComponent(@stateParams.redirect_uri)}&token=#{token}&uuid=#{uuid}&state=#{@stateParams.state}"

  cancel: =>
    url = @stateParams.cancel_uri || 'https://app.octoblu.com'
    @window.location = url

angular.module('octobluApp').controller 'OAuthProviderController', OAuthProviderController
