class NewProfileController

  constructor: (ProfileService, $state) ->
    @ProfileService = ProfileService
    @state          = $state

  submit: (firstName, lastName, email, optInEmail, agreeTermsOfService) =>
    @newProfileForm.firstName.$setTouched()
    @newProfileForm.lastName.$setTouched()
    @newProfileForm.email.$setTouched()

    return unless @newProfileForm.$valid

    @loading = true
    # console.log "Response:", @ProfileService.create firstName, lastName, email, optInEmail, agreeTermsOfService

    @ProfileService
      .update firstName, lastName, email, optInEmail
      .then () =>
        @state.go 'material.home'
      .catch (error) =>
        @loading = false

  emailRequiredError: =>
    return true if @newProfileForm.email.$error.required && @newProfileForm.email.$touched

  firstNameRequiredError: =>
    return true if @newProfileForm.firstName.$error.required && @newProfileForm.firstName.$touched

  lastNameRequiredError: =>
    return true if @newProfileForm.lastName.$error.required && @newProfileForm.lastName.$touched

angular.module('octobluApp').controller 'NewProfileController', NewProfileController
