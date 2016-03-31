class TopBarController
  constructor: ($scope, $state, AuthService) ->
    @scope       = $scope
    @state       = $state
    @AuthService = AuthService
    @showUserNav = false

    @isCWCUser().then (isCWCUser) => @scope.isCWCUser = isCWCUser

  logout: =>
    @AuthService.logout().then => @state.go 'login'

  isCWCUser: =>
    @AuthService.getCurrentUser().then (currentUser) => return currentUser.userDevice.cwc?


angular.module('octobluApp').controller 'TopBarController', TopBarController
