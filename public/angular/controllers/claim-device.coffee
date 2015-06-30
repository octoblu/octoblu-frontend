class ClaimNodeController
  constructor:  ($stateParams, $q, $state, ThingService, deviceService) ->
    @stateParams = $stateParams
    @q = $q
    @state = $state
    @deviceService = deviceService
    @getDevice()
      .then (device) =>
        @device = device
      .catch (errorMessage) =>
        @errorMessage = errorMessage

  getDevice: =>
    return @q.reject 'Unable to retrieve device, missing uuid' unless @stateParams.uuid?
    query = {}
    query.uuid = @stateParams.uuid
    @deviceService.getUnclaimedNodes(query)
      .then (devices) =>
        _.first devices

  claimDevice: =>
    return @q.reject 'Unable to claim device, missing uuid' unless @stateParams.uuid?
    device = {}
    device.name = @deviceName
    device.uuid = @stateParams.uuid
    @deviceService.claimDevice device
      .then =>
        state = 'material.design'
        state = 'material.nodewizard.addnode' if @device.type == 'device:gateblu'
        @state.go state
        return device


angular.module('octobluApp').controller 'ClaimNodeController', ClaimNodeController
