class OAuthProviderController
  constructor: ($scope, $stateParams, $cookies, $q, $window, OAUTH_PROVIDER, OCTOBLU_API_URL, OCTOBLU_ICON_URL, MeshbluDeviceService, AuthService, ThingService, MeshbluHttpService) ->
    @window = $window
    @cookies = $cookies
    @AuthService = AuthService
    @ThingService = ThingService
    @oauthUUID = $stateParams.uuid
    @OAUTH_PROVIDER = OAUTH_PROVIDER
    @MeshbluHttpService = MeshbluHttpService
    @stateParams = $stateParams
    @OCTOBLU_API_URL = OCTOBLU_API_URL
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL
    @q = $q

    $scope.loading = true
    MeshbluDeviceService.get(@oauthUUID).then (oauthDevice) =>
      oauthDevice ?= {}
      oauthDevice.options ?= {}
      oauthDevice.options.imageUrl ?= "#{@OCTOBLU_ICON_URL}/device/oauth.svg"
      oauthDevice.options.description ?= ''
      $scope.oauthDevice = oauthDevice
    .then =>
      @AuthService.getCurrentUser().then (user) =>
        $scope.currentUser = user
    .then =>
      @q (resolve) =>
        user = $scope.currentUser.userDevice
        hasAuthorizedClientBefore = _.get user, ['octoblu','oauth', 'clients', @oauthUUID]
        return @authorize() if hasAuthorizedClientBefore
        $scope.loading = false
        resolve()

    $scope.authorize = @authorize
    $scope.cancel = @cancel

  authorize: =>
    device   = uuid: @cookies.meshblu_auth_uuid
    metadata =
      tag: "oauth-exchange-#{@oauthUUID}"
    updateBody = { "$set": { "octoblu.oauth.clients.#{@oauthUUID}": true } }
    @MeshbluHttpService.updateDangerously device.uuid, updateBody, (error) =>
      console.error('Error updating oauth client', error) if error?
      @ThingService.generateSessionToken(device, metadata).then (session) =>
        { token,uuid } = session
        _.delay =>
          @window.location.href = "#{@OAUTH_PROVIDER}#{@stateParams.redirect}?response_type=#{@stateParams.response_type}&client_id=#{@oauthUUID}&redirect_uri=#{encodeURIComponent(@stateParams.redirect_uri)}&token=#{token}&uuid=#{uuid}&state=#{@stateParams.state}"

  cancel: =>
    url = @stateParams.cancel_uri || @OCTOBLU_API_URL
    _.delay =>
      @window.location.href = url

angular.module('octobluApp').controller 'OAuthProviderController', OAuthProviderController
