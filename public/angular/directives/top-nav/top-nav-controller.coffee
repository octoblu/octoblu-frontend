class TopNavController
  constructor: ($state, AuthService) ->
    @state = $state
    @AuthService = AuthService

    @AuthService.getCurrentUser()
      .then (user) =>
        {firstName, lastName, email} = user.userDevice.octoblu
        @email = email
        @name = "#{firstName} #{lastName}"

  logout: () =>
    @AuthService.logout()
      .then => @state.go 'login'


angular.module('octobluApp').controller 'TopNavController', TopNavController
