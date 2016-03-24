describe 'CWCAuthController', ->
  beforeEach ->
    class FakeCWCAuthProxyService
      constructor: (@q) ->
        @authenticateCWCUserDefer = @q.defer()
        @authenticateCWCUser = sinon.stub().returns @authenticateCWCUserDefer.promise
        @createOctobluSession = sinon.stub().returns @q.when()


    module 'octobluApp', ( $provide ) =>
      $provide.value '$state', go: sinon.spy()
      $provide.value '$window', {}
      $provide.value '$cookies', {}
      $provide.value  '$stateParams', {}
      $provide.value 'CWC_APP_STORE_URL', 'https://cwc-store.octoblu.com'
      return

    inject ($controller, $rootScope, $q, CWC_APP_STORE_URL) =>
      @q = $q
      @scope = $rootScope.$new()
      @fakeCWCAuthProxyService= new FakeCWCAuthProxyService @q
      @controller = $controller
      @CWC_APP_STORE_URL = CWC_APP_STORE_URL

  describe "->constructor", ->
    context "when the CWC user has not logged in before", ->
      describe "when given a valid oneTimePassword, customerId and cwcReferralUrl", ->
        beforeEach ->
          @sut = @controller 'CWCAuthController',
            $scope : @scope
            $cookies: @cookies
            $rootScope: @rootScope
            $window: @window
            $state: @state
            $stateParams:
              otp : "stressed-out"
              customerId: "ATribeCalledQuest"
              cwcReferralUrl: @CWC_APP_STORE_URL
            CWC_APP_STORE_URL: @CWC_APP_STORE_URL
            CWCAuthProxyService: @fakeCWCAuthProxyService

        it "should try to authenticate the CWC user using the CWCAuthProxyService", ->
          expect(@fakeCWCAuthProxyService.authenticateCWCUser).to.have.been.calledWith("stressed-out", "ATribeCalledQuest", @CWC_APP_STORE_URL)
