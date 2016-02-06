class TopBarController
  constructor: ($scope, $state, AuthService) ->
    @scope = $scope
    @state = $state
    @AuthService = AuthService

    @showUserNav = false
    @currentNav = @state.current.name
    @bluprintLinks = ['bluprints','bluprintDetail','bluprintImport','oldbluprintImport','discover','discovercollection']

    @activeRoute = @checkActiveRoutes()

  checkActiveRoutes: =>
    return 'design' if @isDesignActive()
    return 'bluprints' if @isBluprintsActive()
    'things'

  isDesignActive: =>
    return true if @currentNav == 'material.design'
    true unless @currentNav != 'material.flow'

  isBluprintsActive: =>
    @routes = @currentNav.split '.'
    _.includes @bluprintLinks, @routes[1]

  isThingsActive: =>
    return false if @isBluprintsActive() || @isDesignActive()
    true


  logout: =>
    @AuthService.logout()
      .then => @state.go 'login'


angular.module('octobluApp').controller 'TopBarController', TopBarController
