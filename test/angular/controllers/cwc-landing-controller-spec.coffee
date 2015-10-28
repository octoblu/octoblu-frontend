describe 'CWCLandingController', ->
  beforeEach ->
    class CWCAccountService
      constructor: (@q) ->
        @validateToken = sinon.spy()

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

  describe "->requestAccess", ->
    beforeEach ->
        @sut = @controller 'CWCLandingController',
          $scope: @scope
          $window: @window
          CWCAccountService : @fakeCWCAccountService



    it "should exist", ->
      expect(@sut.requestAccess).to.exist

    xdescribe "when there is a CWC user token", ->
      beforeEach ->
        @window.localStorage.getItem.withArgs("cwsToken").returns("westside-connection")
        @window.localStorage.getItem.withArgs("customer").returns("Mack-10")
        @sut.requestAccess()

      it "should validate the token", ->
        # expect(@getItemSpy.calledTwice).to.be.true
        expect(@fakeCWCAccountService.validateToken).to.have.been.calledWith("westside-connection","Mack-10")

    xdescribe "when called with an invalid CWC token", ->
      beforeEach ->
        @fakeCWCAccountService.validateToken = sinon.stub()
        @fakeCWCAccountService.validateToken.withArgs("all-eyes-on-me", "mackaveli").yields(@q.resolve(false))
        @window.localStorage.getItem.withArgs("cwsToken").returns("all-eyes-on-me")
        @window.localStorage.getItem.withArgs("customer").returns("mackaveli")
        @sut.requestAccess()
        @scope.$digest()

      it "should validate the token", ->
        expect(@fakeCWCAccountService.validateToken).to.have.been.calledWith("all-eyes-on-me","mackaveli")
        expect(@scope.errorMessage).to.equal("There was a problem validating your CWC Account, please contact CWC Customer Support")
