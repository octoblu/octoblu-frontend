
class NewProfileController
  constructor: ($cookies, $state, FlowService, ProfileService, userService, FLOW_TUTORIAL_1) ->
    @cookies        = $cookies
    @state          = $state
    @FlowService    = FlowService
    @ProfileService = ProfileService
    @userService    = userService
    @tutorial       = FLOW_TUTORIAL_1

  submit: (firstName, lastName, email, optInEmail, agreeTermsOfService) =>
    emailID = '542ce2ad47a930b1280b0d05'
    smsID   = '542c2f2eab1c05dde14544e0'
    @newProfileForm.firstName.$setTouched()
    @newProfileForm.lastName.$setTouched()
    @newProfileForm.email.$setTouched()

    return unless @newProfileForm.$valid

    @loading = true

    @ProfileService
      .update firstName, lastName, email, optInEmail
      .then =>
        async.series [
          (callback) => @userService.activateNoAuthChannelByType @cookies.meshblu_auth_uuid, 'channel:weather', callback
          (callback) => @userService.activateNoAuthChannelByType @cookies.meshblu_auth_uuid, 'channel:stock-price', callback
          (callback) => @userService.saveBasicApi @cookies.meshblu_auth_uuid, emailID, @cookies.meshblu_auth_uuid, @cookies.meshblu_auth_token, callback
          (callback) => @userService.saveBasicApi @cookies.meshblu_auth_uuid, smsID, @cookies.meshblu_auth_uuid, @cookies.meshblu_auth_token, callback
        ], (error) =>
          @createTutorialFlow().then (flow) =>
            @state.go 'material.flow', flowId: flow.flowId
      .catch (error) =>
        @loading = false

  createTutorialFlow: =>
    emailID = '542ce2ad47a930b1280b0d05'
    flowAttributes =
      tutorial: @tutorial
      name: 'Tutorial Flow'
      nodes: []

    @FlowService.createFlow flowAttributes

  emailRequiredError: =>
    return true if @newProfileForm.email.$error.required && @newProfileForm.email.$touched

  firstNameRequiredError: =>
    return true if @newProfileForm.firstName.$error.required && @newProfileForm.firstName.$touched

  lastNameRequiredError: =>
    return true if @newProfileForm.lastName.$error.required && @newProfileForm.lastName.$touched

angular.module('octobluApp').controller 'NewProfileController', NewProfileController
