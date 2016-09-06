describe 'OAuthProviderController', ->
  beforeEach ->
    module 'octobluApp', ($provide) =>
      $provide.value '$window', {}
      $provide.value '$cookies', {}
      $provide.value 'OAUTH_PROVIDER', 'https://smurfs.bikes'
      return

    inject ($controller, $rootScope, $q, MeshbluHttpService) =>
      @rootScope = $rootScope
      @scope = @rootScope.$new()
      @q = $q
      @controller = $controller
      @MeshbluHttpService = MeshbluHttpService

      class FakeAuthService
        constructor: (@q)->
          @getCurrentUser = sinon.stub().returns(@q.when(true))
          @resetToken = sinon.stub().returns(@q.when(true))
      @AuthService = new FakeAuthService @q

      class FakeMeshbluHttpService
        constructor: (@q) ->
          @device = (device, callback) ->
            callback null, {}
          @searchTokens = (options, callback) ->
            callback null, []

      @MeshbluHttpService = new FakeMeshbluHttpService @q

  describe '->constructor', ->
    describe 'when MeshbluDeviceService never resolves', ->
      beforeEach ->
        deferred = @q.defer()
        @MeshbluDeviceService = get: sinon.stub().returns deferred.promise
        @stateParams = uuid: 'lemon'

        @sut = @controller 'OAuthProviderController',
          MeshbluDeviceService: @MeshbluDeviceService
          ThingService: {}
          $stateParams : @stateParams
          $scope : @scope
          AuthService: @AuthService
          MeshbluHttpService: @MeshbluHttpService

      it 'should indicate that it is loading', ->
        expect(@scope.loading).to.be.true

    describe 'when called with a uuid of something', ->
      beforeEach ->
        @MeshbluDeviceService = get: sinon.stub().returns @q.when({uuid: 'lemon', name: 'heads'})
        @stateParams = uuid: 'lemon'

        @sut = @controller 'OAuthProviderController',
          MeshbluDeviceService: @MeshbluDeviceService
          ThingService: {}
          $stateParams : @stateParams
          $scope : @scope
          AuthService: @AuthService
          MeshbluHttpService: @MeshbluHttpService

        @rootScope.$digest()

      it 'should call get with the uuid from the url', ->
        expect(@MeshbluDeviceService.get).to.have.been.calledWith 'lemon'

      it 'should set $scope.oauthDevice', ->
        expect(@scope.oauthDevice).to.deep.equal {uuid: 'lemon', name: 'heads', options: {imageUrl: 'https://icons.octoblu.com/device/oauth.svg', description : ''}}

      it 'should set loading to false', ->
        expect(@scope.loading).to.be.false

    describe 'when called with a uuid of skittles', ->
      beforeEach ->
        @MeshbluDeviceService = get: sinon.stub().returns @q.when({uuid: 'skittles', name: 'rainbow'})
        @stateParams = uuid: 'skittles'

        @sut = @controller 'OAuthProviderController',
          MeshbluDeviceService: @MeshbluDeviceService
          ThingService: {}
          $stateParams : @stateParams
          $scope : @scope
          AuthService: @AuthService
          MeshbluHttpService: @MeshbluHttpService

        @rootScope.$digest()

      it 'should call get with the uuid from the url', ->
        expect(@MeshbluDeviceService.get).to.have.been.calledWith 'skittles'

      it 'should set $scope.oauthDevice', ->
        expect(@scope.oauthDevice).to.deep.equal {uuid: 'skittles', name: 'rainbow', options: {imageUrl: 'https://icons.octoblu.com/device/oauth.svg', description : ''}}

  describe '->authorize', ->
    describe 'when called with session-token', ->
      beforeEach (done) ->
        @ThingService = generateSessionToken: sinon.stub().returns @q.when(token: 'session-token', uuid: 'junior-mints')
        @window = location: href: null

        @sut = @controller 'OAuthProviderController',
          MeshbluDeviceService: get: => @q.when()
          ThingService: @ThingService
          $stateParams: {uuid: 'snickers', state: '123', redirect_uri: 'foo', redirect: '/bar', response_type: 'code'}
          $scope: @scope
          $window: @window
          AuthService: @AuthService
          MeshbluHttpService: @MeshbluHttpService

        @sut.authorize().then =>
          _.delay done
        @rootScope.$digest()

      it 'should call ThingService.generateSessionToken', ->
        expect(@ThingService.generateSessionToken).to.have.been.called

      it 'should redirect the user', ->
        expect(@window.location.href).to.equal 'https://smurfs.bikes/bar?response_type=code&client_id=snickers&redirect_uri=foo&token=session-token&uuid=junior-mints&state=123'

    describe 'when called with token-session', ->
      beforeEach (done) ->
        @ThingService = generateSessionToken: sinon.stub().returns @q.when(token: 'token-session', uuid: 'mnms')
        @window = location: href: null

        @sut = @controller 'OAuthProviderController',
          MeshbluDeviceService: get: => @q.when()
          ThingService: @ThingService
          $scope: @scope
          $stateParams: {uuid: 'mars', state: '123', redirect_uri: 'foo', redirect: '/bar', response_type: 'code'}
          $window: @window
          AuthService: @AuthService
          MeshbluHttpService: @MeshbluHttpService

        @sut.authorize().then =>
          _.delay done
        @rootScope.$digest()

      it 'should call ThingService.generateSessionToken', ->
        expect(@ThingService.generateSessionToken).to.have.been.called

      it 'should redirect the user', ->
        expect(@window.location.href).to.equal 'https://smurfs.bikes/bar?response_type=code&client_id=mars&redirect_uri=foo&token=token-session&uuid=mnms&state=123'
