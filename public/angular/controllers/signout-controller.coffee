class SignoutController
  constructor: (AuthService, $state) ->
    @AuthService = AuthService
    @state = $state

    @loggingOut = true

    @AuthService.logout()
      .then =>
        @loggingOut = false
        @state.go 'login'

angular.module('octobluApp').controller 'SignoutController', SignoutController
