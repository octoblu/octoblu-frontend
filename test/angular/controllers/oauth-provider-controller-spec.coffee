describe 'OAuthProviderController', ->
  beforeEach ->
    module 'octobluApp'

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
    beforeEach ->
      @ProfileService = generateSessionToken: sinon.spy()
      @sut = @controller 'OAuthProviderController',
        MeshbluDeviceService: get: => @q.when()
        ProfileService: @ProfileService
        $scope: @scope

      @sut.authorize()

    it 'should call ProfileService.generateSessionToken', ->
      expect(@ProfileService.generateSessionToken).to.have.been.called




