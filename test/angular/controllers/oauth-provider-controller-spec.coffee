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

  describe '->constructor', ->
    describe 'when called with a uuid of something', ->
      beforeEach ->
        @MeshbluDeviceService = get: sinon.stub().returns @q.when({uuid: 'lemon', name: 'heads'})
        @stateParams = uuid: 'lemon'

        @sut = @controller 'OAuthProviderController',
          MeshbluDeviceService: @MeshbluDeviceService
          ProfileService: {}
          $stateParams : @stateParams
          $scope : @scope

        @rootScope.$digest()

      it 'should call get with the uuid from the url', ->
        expect(@MeshbluDeviceService.get).to.have.been.calledWith 'lemon'

      it 'should set $scope.oauthDevice', ->
        expect(@scope.oauthDevice).to.deep.equal {uuid: 'lemon', name: 'heads'}

    describe 'when called with a uuid of skittles', ->
      beforeEach ->
        @MeshbluDeviceService = get: sinon.stub().returns @q.when({uuid: 'skittles', name: 'rainbow'})
        @stateParams = uuid: 'skittles'

        @sut = @controller 'OAuthProviderController',
          MeshbluDeviceService: @MeshbluDeviceService
          ProfileService: {}
          $stateParams : @stateParams
          $scope : @scope

        @rootScope.$digest()

      it 'should call get with the uuid from the url', ->
        expect(@MeshbluDeviceService.get).to.have.been.calledWith 'skittles'

      it 'should set $scope.oauthDevice', ->
        expect(@scope.oauthDevice).to.deep.equal {uuid: 'skittles', name: 'rainbow'}

  describe '->authorize', ->
    describe 'when called with session-token', ->
      beforeEach ->
        @ProfileService = generateSessionToken: sinon.stub().returns @q.when(token: 'session-token', uuid: 'junior-mints')
        @window = location: null

        @sut = @controller 'OAuthProviderController',
          MeshbluDeviceService: get: => @q.when()
          ProfileService: @ProfileService
          $stateParams: {uuid: 'snickers'}
          $scope: @scope
          $window: @window

        @sut.authorize()
        @rootScope.$digest()

      it 'should call ProfileService.generateSessionToken', ->
        expect(@ProfileService.generateSessionToken).to.have.been.called

      it 'should redirect the user', ->
        expect(@window.location).to.equal 'https://smurfs.bikes/snickers?token=session-token&uuid=junior-mints'

    describe 'when called with token-session', ->
      beforeEach ->
        @ProfileService = generateSessionToken: sinon.stub().returns @q.when(token: 'token-session', uuid: 'mnms')
        @window = location: null

        @sut = @controller 'OAuthProviderController',
          MeshbluDeviceService: get: => @q.when()
          ProfileService: @ProfileService
          $scope: @scope
          $stateParams: {uuid: 'mars'}
          $window: @window

        @sut.authorize()
        @rootScope.$digest()

      it 'should call ProfileService.generateSessionToken', ->
        expect(@ProfileService.generateSessionToken).to.have.been.called

      it 'should redirect the user', ->
        expect(@window.location).to.equal 'https://smurfs.bikes/mars?token=token-session&uuid=mnms'
