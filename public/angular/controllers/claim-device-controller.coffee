class ClaimNodeController
  constructor:  ($stateParams, $q, $state, $cookies, ThingService, OCTOBLU_ICON_URL) ->
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
        @device.logo = @logoUrl @device
      .catch (errorMessage) =>
        @loading = false
        @errorMessage = errorMessage

  logoUrl: (device) =>
    return device.logo if device.logo
    return device.logo = "#{@OCTOBLU_ICON_URL}node/other.svg" unless device && device.type

    type = device.type.replace 'octoblu:', 'device:'
    device.logo = @OCTOBLU_ICON_URL + type.replace(':', '/') + '.svg'
    device.logo

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
        @state.go 'material.configure', added: @deviceName
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
