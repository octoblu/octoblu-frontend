class ClaimNodeController
  constructor:  ($stateParams, $q, $state, $cookies, ThingService, MESHBLU_PORT, MESHBLU_HOST, OCTOBLU_ICON_URL) ->
    @stateParams = $stateParams
    @q = $q
    @state = $state
    @cookies = $cookies
    @ThingService = ThingService
    @loading = true
    @meshbluHttp = new MeshbluHttp {
      port: MESHBLU_PORT,
      hostname: MESHBLU_HOST,
      uuid: @stateParams.uuid,
      token: @stateParams.token
    }
    @meshbluHttp.whoami (error, device) =>
      @loading = false
      if error?
        @errorMessage = errorMessage
        return
      @deviceName = device.name
      @device = device
      @device.logo = @logoUrl @device
      @fragments = [{linkTo: 'material.things', label: 'All Things'},{label: "Claim Thing"}]

  logoUrl: (device) =>
    return device.logo if device.logo
    return device.logo = "#{@OCTOBLU_ICON_URL}node/other.svg" unless device && device.type

    type = device.type.replace 'octoblu:', 'device:'
    device.logo = @OCTOBLU_ICON_URL + type.replace(':', '/') + '.svg'
    device.logo

  iWantToClaimTheDevice: =>
    @loading = true
    @claimDevice()
      .then =>
        @errorMessage = null
        @loading = false
        @state.go 'material.configure', added: @deviceName
      .catch (error) =>
        @loading = false
        @errorMessage = error

  claimDevice: =>
    return @q.reject 'Unable to claim device, missing uuid' unless @stateParams.uuid?
    return @q.reject 'Unable to claim device, missing token' unless @stateParams.token?
    deferred = @q.defer()
    user = uuid: @cookies.meshblu_auth_uuid
    @ThingService.claimThing @stateParams, user, name: @deviceName
      .catch deferred.reject
      .then =>
        deferred.resolve()

    return deferred.promise

angular.module('octobluApp').controller 'ClaimNodeController', ClaimNodeController
