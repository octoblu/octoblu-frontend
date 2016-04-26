describe 'OAuthProviderController', ->
  beforeEach ->
    module 'octobluApp', ($provide) =>
      $provide.value '$window', {}
      $provide.value 'OAUTH_PROVIDER', 'https://smurfs.bikes'
      return

    inject ($controller, $rootScope, $q) =>
      @rootScope = $rootScope
      @scope = @rootScope.$new()
      @q = $q
      @controller = $controller

      class FakeAuthService
        constructor: (@q)->
          @getCurrentUser = sinon.stub().returns(@q.when(true))
          @resetToken = sinon.stub().returns(@q.when(true))
      @AuthService = new FakeAuthService @q

  describe '->constructor', ->
    describe 'when MeshbluDeviceService never resolves', ->
      beforeEach ->
        deferred = @q.defer()
        @MeshbluDeviceService = get: sinon.stub().returns deferred.promise
        @stateParams = uuid: 'lemon'

        @sut = @controller 'OAuthProviderController',
          MeshbluDeviceService: @MeshbluDeviceService
          ProfileService: {}
          $stateParams : @stateParams
          $scope : @scope
          AuthService: @AuthService

      it 'should indicate that it is loading', ->
        expect(@scope.loading).to.be.true

    describe 'when called with a uuid of something', ->
      beforeEach ->
        @MeshbluDeviceService = get: sinon.stub().returns @q.when({uuid: 'lemon', name: 'heads'})
        @stateParams = uuid: 'lemon'

        @sut = @controller 'OAuthProviderController',
          MeshbluDeviceService: @MeshbluDeviceService
          ProfileService: {}
          $stateParams : @stateParams
          $scope : @scope
          AuthService: @AuthService

        @rootScope.$digest()

      it 'should call get with the uuid from the url', ->
        expect(@MeshbluDeviceService.get).to.have.been.calledWith 'lemon'

      it 'should set $scope.oauthDevice', ->
        expect(@scope.oauthDevice).to.deep.equal {uuid: 'lemon', name: 'heads', options: {imageUrl: 'https://ds78apnml6was.cloudfront.net/device/oauth.svg', description : 'No extended description provided.'}}

      it 'should set loading to false', ->
        expect(@scope.loading).to.be.false

    describe 'when called with a uuid of skittles', ->
      beforeEach ->
        @MeshbluDeviceService = get: sinon.stub().returns @q.when({uuid: 'skittles', name: 'rainbow'})
        @stateParams = uuid: 'skittles'

        @sut = @controller 'OAuthProviderController',
          MeshbluDeviceService: @MeshbluDeviceService
          ProfileService: {}
          $stateParams : @stateParams
          $scope : @scope
          AuthService: @AuthService

        @rootScope.$digest()

      it 'should call get with the uuid from the url', ->
        expect(@MeshbluDeviceService.get).to.have.been.calledWith 'skittles'

      it 'should set $scope.oauthDevice', ->
        expect(@scope.oauthDevice).to.deep.equal {uuid: 'skittles', name: 'rainbow', options: {imageUrl: 'https://ds78apnml6was.cloudfront.net/device/oauth.svg', description : 'No extended description provided.'}}

  describe '->authorize', ->
    describe 'when called with session-token', ->
      beforeEach ->
        @ProfileService = generateSessionToken: sinon.stub().returns @q.when(token: 'session-token', uuid: 'junior-mints')
        @window = location: null

        @sut = @controller 'OAuthProviderController',
          MeshbluDeviceService: get: => @q.when()
          ProfileService: @ProfileService
          $stateParams: {uuid: 'snickers', state: '123', redirect_uri: 'foo', redirect: '/bar', response_type: 'code'}
          $scope: @scope
          $window: @window
          AuthService: @AuthService

        @sut.authorize()
        @rootScope.$digest()

      it 'should call ProfileService.generateSessionToken', ->
        expect(@ProfileService.generateSessionToken).to.have.been.called

      it 'should redirect the user', ->
        expect(@window.location).to.equal 'https://smurfs.bikes/bar?response_type=code&client_id=snickers&redirect_uri=foo&token=session-token&uuid=junior-mints&state=123'

    describe 'when called with token-session', ->
      beforeEach ->
        @ProfileService = generateSessionToken: sinon.stub().returns @q.when(token: 'token-session', uuid: 'mnms')
        @window = location: null

        @sut = @controller 'OAuthProviderController',
          MeshbluDeviceService: get: => @q.when()
          ProfileService: @ProfileService
          $scope: @scope
          $stateParams: {uuid: 'mars', state: '123', redirect_uri: 'foo', redirect: '/bar', response_type: 'code'}
          $window: @window
          AuthService: @AuthService

        @sut.authorize()
        @rootScope.$digest()

      it 'should call ProfileService.generateSessionToken', ->
        expect(@ProfileService.generateSessionToken).to.have.been.called

      it 'should redirect the user', ->
        expect(@window.location).to.equal 'https://smurfs.bikes/bar?response_type=code&client_id=mars&redirect_uri=foo&token=token-session&uuid=mnms&state=123'
