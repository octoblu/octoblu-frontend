class NewProfileController

  constructor: (ProfileService) ->
    @ProfileService = ProfileService


  submit: (firstName, lastName, email, optInEmail, agreeTermsOfService) =>
    @newProfileForm.firstName.$setTouched()
    @newProfileForm.lastName.$setTouched()
    @newProfileForm.email.$setTouched()

    return unless @newProfileForm.$valid

    @loading = true
    # console.log "Response:", @ProfileService.create firstName, lastName, email, optInEmail, agreeTermsOfService

    @ProfileService
      .update firstName, lastName, email, optInEmail
      .then (result) =>
        console.log 'RESULT: ', result
      .catch (error) =>
        @loading = false

  emailRequiredError: =>
    return true if @newProfileForm.email.$error.required && @newProfileForm.email.$touched

  firstNameRequiredError: =>
    return true if @newProfileForm.firstName.$error.required && @newProfileForm.firstName.$touched

  lastNameRequiredError: =>
    return true if @newProfileForm.lastName.$error.required && @newProfileForm.lastName.$touched

angular.module('octobluApp').controller 'NewProfileController', NewProfileController
