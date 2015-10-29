describe 'CWCLandingController', ->
  beforeEach ->
    class CWCAccountService
      constructor: (@q) ->
        @validateToken = sinon.stub()
        @createOctobluSession = sinon.stub()

    @fakeWindow = localStorage: getItem: sinon.stub()

    module 'octobluApp', ($provide) =>
      $provide.value '$window', @fakeWindow
      return

    inject ($controller, $rootScope, $q, $window) =>
      @q = $q
      @scope = $rootScope.$new()
      @fakeCWCAccountService = new CWCAccountService @q
      @window = $window
      @controller = $controller
      @sut = @controller 'CWCLandingController',
                $scope: @scope
                $window: @window
                CWCAccountService : @fakeCWCAccountService

  describe "when there is a CWC user token", ->
    beforeEach ->
      @fakeCWCAccountService.validateToken.returns(@q.when(true))
      @window.localStorage.getItem.withArgs("cwsToken").returns "westside-connection"
      @window.localStorage.getItem.withArgs("customer").returns "Mack-10"
      @sut.requestAccess()
      @scope.$digest()

    it "should validate the token", ->
      # expect(@getItemSpy.calledTwice).to.be.true
      expect(@fakeCWCAccountService.validateToken).to.have.been.calledWith("westside-connection","Mack-10")

  describe "when called with an invalid CWC token", ->
    beforeEach ->
      @fakeCWCAccountService.validateToken.withArgs("all-eyes-on-me", "mackaveli").returns @q.when(false)
      @window.localStorage.getItem.withArgs("cwsToken").returns "all-eyes-on-me"
      @window.localStorage.getItem.withArgs("customer").returns "mackaveli"
      @sut.requestAccess()
      @scope.$digest()

    it "should set the error message", ->
      expect(@scope.errorMessage).to.equal("There was a problem validating your CWC Account, please contact CWC Customer Support")

  describe "when called with a valid CWC token", ->
    beforeEach ->
      @fakeCWCAccountService.validateToken.withArgs("hold-me-down", "gorillaz").returns @q.when(true)
      @window.localStorage.getItem.withArgs("cwsToken").returns "hold-me-down"
      @window.localStorage.getItem.withArgs("customer").returns "gorillaz"
      @sut.requestAccess()
      @scope.$digest()

    it "should create an Octoblu session", ->
      expect(@fakeCWCAccountService.createOctobluSession).to.have.been.calledWith("hold-me-down")
