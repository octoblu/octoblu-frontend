describe "DeviceService", ->
  beforeEach ->
    module 'octobluApp', ($provide) =>
       @fakePermissionsService = new FakePermissionsService
       @fakeSkynetConnection = new FakeSkynetConnection
       @fakeSkynetService = new FakeSkynetService

       $provide.value 'PermissionService', @fakePermissionService
       $provide.value 'skynetService', @fakeSkynetService
       $provide.value 'reservedProperties', ['$$hashKey', '_id']
       $provide.value 'OCTOBLU_ICON_URL', ''
       return

    inject (skynetService, $q, $httpBackend, $rootScope) =>
      @q = $q
      @rootScope = $rootScope
      sinon.stub(@fakeSkynetService, 'getSkynetConnection').returns @q.when @fakeSkynetConnection

    inject (deviceService) =>
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

      describe "when it is resolved with the token token5", ->
        beforeEach ->
          sinon.stub(@fakeSkynetConnection, 'resetToken').yields token: 'token5'
          _.defer @rootScope.$digest
          @sut.resetToken 'uuid3'

        it "should call resetToken on the skynetConnection with the value uuid3", ->
          expect(@fakeSkynetConnection.resetToken).to.have.been.calledWith 'uuid3'

  class FakePermissionsService

  class FakeSkynetService
    getSkynetConnection: =>

  class FakeSkynetConnection
    constructor: ->
    on: =>
    mydevices: =>
    message: =>
    subscribe: =>
    resetToken: (uuid, callback) =>

