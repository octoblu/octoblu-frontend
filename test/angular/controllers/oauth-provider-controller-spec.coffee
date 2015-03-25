describe 'OAuthProviderController', ->
  beforeEach ->
    module 'octobluApp'

    inject ($controller, $rootScope) =>
      @rootScope = $rootScope
      @sut = $controller 'OAuthController'
