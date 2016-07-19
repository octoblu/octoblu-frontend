class ProfileController
  constructor: ($cookies, $scope, $mdDialog, NotifyService, ThingService, ProfileService, MeshbluHttpService) ->
    @uuid           = $cookies.meshblu_auth_uuid
    @scope          = $scope
    @mdDialog       = $mdDialog
    @ProfileService = ProfileService
    @NotifyService  = NotifyService
    @ThingService   = ThingService
    @loading = true
    @loadUser()

  loadUser: =>
    @ThingService.getThing { @uuid }
      .then (@userDevice) =>
        @loading = false
        @userModel = _.cloneDeep @userDevice.octoblu
      .catch (error) =>
        @loading = false
        @NotifyService.notifyError error

  submitProfile: =>
    @profileForm.firstName.$setTouched()
    @profileForm.lastName.$setTouched()
    @profileForm.email.$setTouched()

    return unless @profileForm.$valid

    @loading = true

    @ProfileService
      .updateAfter @userModel
      .then =>
        @loading = false
        @NotifyService.notify 'User updated'
        @loadUser()
      .catch (error) =>
        @NotifyService.notifyError error
        @loading = false

  emailRequiredError: =>
    return false unless @profileForm?
    return true if @profileForm.email.$error.required && @profileForm.email.$touched

  firstNameRequiredError: =>
    return false unless @profileForm?
    return true if @profileForm.firstName.$error.required && @profileForm.firstName.$touched

  lastNameRequiredError: =>
    return false unless @profileForm?
    return true if @profileForm.lastName.$error.required && @profileForm.lastName.$touched

  generateSessionToken: =>
    @ThingService.generateSessionToken({ @uuid })
      .then (session) =>
        alertOptions = {
          title: 'New Session Token'
          content: session.token
          ok: 'Dismiss'
        }

        theAlert = @mdDialog.alert(alertOptions).clickOutsideToClose false
        @mdDialog.show theAlert
        @loadUser()

angular.module('octobluApp').controller 'ProfileController', ProfileController
