describe "DeviceService", ->
  beforeEach ->
    module 'octobluApp', ($provide) =>
       @fakePermissionsService = new FakePermissionsService
       @fakeSkynetConnection = new FakeSkynetConnection
       @fakeSkynetService = new FakeSkynetService

       $provide.value 'PermissionService', @fakePermissionService
       $provide.value 'skynetService', @fakeSkynetService
       return

    inject (skynetService, $q, $httpBackend) =>
      skynetService.q = $q
      @q = $q
      $httpBackend.whenGET("/api/auth").respond 200
      $httpBackend.whenGET("/pages/material.html").respond 200
      $httpBackend.whenGET("/pages/home.html").respond 200
      sinon.stub(@fakeSkynetService, 'getSkynetConnection').returns(@q.when(@fakeSkynetConnection))

    inject (deviceService, $rootScope) =>
      @rootScope = $rootScope
      @sut = deviceService


  it "should exist", ->
    expect(@sut).to.exist

  describe "resetToken", ->

    it "should exist", ->
      expect(@sut.resetToken).to.exist

    describe "when it is called", ->
      it "should return a promise", ->
        result = @sut.resetToken()
        expect(result.then).to.exist;

      describe "when it is resolved", ->
        beforeEach ->
          sinon.stub(@fakeSkynetConnection, 'resetToken').returns(@q.when(5))
          _.defer @rootScope.$digest
          @sut.resetToken(3)

        it "should call resetToken on the skynetConnection", ->
          expect(@fakeSkynetConnection.resetToken).to.have.been.called

  class FakePermissionsService

  class FakeSkynetService
    getSkynetConnection: =>

  class FakeSkynetConnection
    constructor: ->
      @subscribe = sinon.spy @subscribe
      @message = sinon.spy @message

    on: =>
    mydevices: =>
    message: =>
    subscribe: =>
    resetToken: =>

