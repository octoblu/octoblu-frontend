class ClaimNodeController
  constructor:  ($stateParams, $q, $state, $cookies, ThingService, MESHBLU_PORT, MESHBLU_HOST, DeviceLogo) ->
    @stateParams = $stateParams
    @q = $q
    @state = $state
    @cookies = $cookies
    @ThingService = ThingService
    @DeviceLogo = DeviceLogo
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
    new @DeviceLogo(device).get()

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
