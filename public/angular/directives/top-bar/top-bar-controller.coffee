class TopBarController
  constructor: ($state, AuthService) ->
    @state = $state
    @AuthService = AuthService
    @showUserNav = false

    @AuthService.getCurrentUser()
      .then (user) =>
        {firstName, lastName, email} = user.userDevice.octoblu
        @name = "#{firstName} #{lastName}"
        @email = email

  logout: () =>
    @AuthService.logout()
      .then => @state.go 'login'


angular.module('octobluApp').controller 'TopBarController', TopBarController
