describe.only 'WorkspaceCloudController', ->
  beforeEach ->
    module 'octobluApp', ($provide) =>
      $provide.value '$state', go: sinon.spy()
      $provide.value '$window', {}
      $provide.value '$cookies', {}
      $provide.value  '$stateParams', {}
      $provide.value 'CWC_APP_STORE_URL', 'https://cwc-store.octoblu.com'
      $provide.value  'CWC_STAGING_URL', 'https://workspace.cloudburitto.com'
      return

    inject ($controller, $rootScope, $state, $q, $cookies, $window,CWC_STAGING_URL, CWC_APP_STORE_URL) =>
      @rootScope = $rootScope
      @scope = @rootScope.$new()
      @q = $q
      @window = $window
      @state = $state
      @CWC_STAGING_URL = CWC_STAGING_URL
      @CWC_APP_STORE_URL = CWC_APP_STORE_URL
      @controller = $controller

  describe '->constructor', ->
    describe 'when there is no referrer URL set', ->
      beforeEach ->

        @sut = @controller('WorkspaceCloudController', {
          $scope : @scope
          $cookies: @cookies
          $rootScope: @rootScope
          $window: @window
          $state: @state
          $stateParams: {}
          })

      it 'should redirect you to the login page', ->
        expect(@state.go).to.have.been.calledWith('login', {})

    describe 'when the referrer URL is empty', ->
      beforeEach ->

        @sut = @controller('WorkspaceCloudController', {
          $scope : @scope
          $cookies: @cookies
          $rootScope: @rootScope
          $state: @state
          $window:
            referrer : ""
          $stateParams: {}
          })

      it 'should redirect you to the login page', ->
        expect(@state.go).to.have.been.calledWith('login', {})
