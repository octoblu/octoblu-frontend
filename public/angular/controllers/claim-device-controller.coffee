class ClaimNodeController
  constructor:  ($stateParams, $q, $state, $cookies, ThingService) ->
    @stateParams = $stateParams
    @q = $q
    @state = $state
    @cookies = $cookies
    @ThingService = ThingService
    @loading = true
    @getDevice()
      .then (device) =>
        @loading = false
        @deviceName = device.name
        @device = device
      .catch (errorMessage) =>
        @loading = false
        @errorMessage = errorMessage

  getDevice: =>
    return @q.reject 'Unable to retrieve device, missing uuid' unless @stateParams.uuid?
    return @q.reject 'Unable to retrieve device, missing token' unless @stateParams.token?
    query = {}
    query.uuid = @stateParams.uuid
    query.token = @stateParams.token
    @ThingService.getThing(query)

  addUserToWhitelist: (device={}) =>
    uuid = @cookies.meshblu_auth_uuid
    device.owner = uuid
    device.discoverWhitelist = _.union [uuid], @device.discoverWhitelist || []
    device.configureWhitelist = _.union [uuid], @device.configureWhitelist || []
    device.sendWhitelist = _.union [uuid], @device.sendWhitelist || []
    device.receiveWhitelist = _.union [uuid], @device.receiveWhitelist || []
    device

  iWantToClaimTheDevice: =>
    @loading = true
    @claimDevice()
      .then =>
        @errorMessage = null
        @loading = false
        state = 'material.design'
        state = 'material.nodewizard.addnode' if @device.type == 'device:gateblu'
        @state.go state
      .catch (error) =>
        @loading = false
        @errorMessage = error

  claimDevice: =>
    return @q.reject 'Unable to claim device, missing uuid' unless @stateParams.uuid?
    return @q.reject 'Unable to claim device, missing token' unless @stateParams.token?
    deferred = @q.defer()
    device = @addUserToWhitelist()
    device.name = @deviceName
    device.uuid = @stateParams.uuid
    device.token = @stateParams.token
    @ThingService.updateDevice device
      .catch deferred.reject
      .then =>
        deviceConfig = {}
        deviceConfig.uuid = device.uuid
        deviceConfig.token = device.token
        @ThingService.revokeToken deviceConfig
      .catch deferred.reject
      .then =>
        deferred.resolve()

    return deferred.promise

angular.module('octobluApp').controller 'ClaimNodeController', ClaimNodeController
