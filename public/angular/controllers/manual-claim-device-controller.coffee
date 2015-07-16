class ManualClaimNodeController
  constructor:  ($state, $cookies, ThingService) ->
    @state = $state
    @ThingService = ThingService
    @user = uuid: $cookies.meshblu_auth_uuid
    @query = {}

  claimThing: =>
    @loading = true
    @ThingService.claimThing(@query, @user, {name: @name})
      .then =>
        @state.go 'material.device', uuid: @query.uuid
      .catch (error) =>
        @loading = false
        @errorMessage = 'Cannot claim the device with that UUID and Token. Please make sure they have been entered correctly.'

  nameRequiredError: =>
    return true if @claimDeviceForm.name.$error.required && @claimDeviceForm.name.$touched

  uuidRequiredError: =>
    return true if @claimDeviceForm.uuid.$error.required && @claimDeviceForm.uuid.$touched

  tokenRequiredError: =>
    return true if @claimDeviceForm.token.$error.required && @claimDeviceForm.token.$touched

angular.module('octobluApp').controller 'ManualClaimNodeController', ManualClaimNodeController
