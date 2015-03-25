class NewProfileController
  constructor: ($cookies, $state, FlowService, ProfileService, FLOW_TUTORIAL_1) ->
    @cookies        = $cookies
    @state          = $state
    @FlowService    = FlowService
    @ProfileService = ProfileService
    @tutorial       = FLOW_TUTORIAL_1

  submit: (firstName, lastName, email, optInEmail, agreeTermsOfService) =>
    @newProfileForm.firstName.$setTouched()
    @newProfileForm.lastName.$setTouched()
    @newProfileForm.email.$setTouched()

    return unless @newProfileForm.$valid

    @loading = true

    @ProfileService
      .update firstName, lastName, email, optInEmail
      .then () =>
        @createTutorialFlow()
          .then (flow) =>
            @state.go 'material.flow', flowId: flow.flowId
      .catch (error) =>
        @loading = false

  createTutorialFlow: =>
    flowAttributes = 
      tutorial: @tutorial
      name: 'Tutorial Flow'
      
    @FlowService.createFlow flowAttributes 
      .then (flow) =>
        # userService.activateNoAuthChannel @cookies.meshblu_auth_uuid,  
        return flow

  emailRequiredError: =>
    return true if @newProfileForm.email.$error.required && @newProfileForm.email.$touched

  firstNameRequiredError: =>
    return true if @newProfileForm.firstName.$error.required && @newProfileForm.firstName.$touched

  lastNameRequiredError: =>
    return true if @newProfileForm.lastName.$error.required && @newProfileForm.lastName.$touched

angular.module('octobluApp').controller 'NewProfileController', NewProfileController
