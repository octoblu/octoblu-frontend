
class NewProfileController
  constructor: ($cookies, $scope, $state, $stateParams, FlowService, ProfileService, userService) ->
    @cookies        = $cookies
    @scope          = $scope
    @state          = $state
    @stateParams    = $stateParams
    @FlowService    = FlowService
    @ProfileService = ProfileService
    @userService    = userService

    @populateProfileFromParams()

  submit: (firstName, lastName, email, optInEmail) =>
    emailID = '542ce2ad47a930b1280b0d05'
    smsID   = '542c2f2eab1c05dde14544e0'
    @newProfileForm.firstName.$setTouched()
    @newProfileForm.lastName.$setTouched()
    @newProfileForm.email.$setTouched()

    return unless @newProfileForm.$valid

    @loading = true

    @ProfileService
      .updateNew firstName, lastName, email, optInEmail, @workspaceCloudUser
      .then =>
        async.series [
          (callback) => @userService.activateNoAuthChannelByType @cookies.meshblu_auth_uuid, 'channel:weather', callback
          (callback) => @userService.activateNoAuthChannelByType @cookies.meshblu_auth_uuid, 'channel:stock-price', callback
          (callback) => @userService.saveMeshbluApi emailID, @cookies.meshblu_auth_uuid, callback
          (callback) => @userService.saveMeshbluApi smsID, @cookies.meshblu_auth_uuid, callback
        ], (error) =>
          console.error(error)
          @addDemoFlow().then (flow) =>
            @state.go 'material.flow', flowId: flow.flowId
      .catch (error) =>
        console.error(error)
        @loading = false

  populateProfileFromParams: =>
    { firstName, lastName, email } = @stateParams
    @scope.firstName = firstName if firstName?
    @scope.lastName = lastName if lastName?
    @scope.email = email if email?

  addDemoFlow: =>
    @FlowService.createDemoFlow name: 'Demo Flow'

  emailRequiredError: =>
    return false unless @newProfileForm?
    return true if @newProfileForm.email.$error.required && @newProfileForm.email.$touched

  firstNameRequiredError: =>
    return false unless @newProfileForm?
    return true if @newProfileForm.firstName.$error.required && @newProfileForm.firstName.$touched

  lastNameRequiredError: =>
    return false unless @newProfileForm?
    return true if @newProfileForm.lastName.$error.required && @newProfileForm.lastName.$touched

angular.module('octobluApp').controller 'NewProfileController', NewProfileController
