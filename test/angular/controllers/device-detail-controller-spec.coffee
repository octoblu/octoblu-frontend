describe 'DeviceDetailController', ->
  beforeEach =>
    module 'octobluApp'

    inject ($controller, $rootScope, $q) =>
      @q = $q
      @scope = $rootScope.$new()
      @scope.confirmModal = sinon.spy()
      @fakeModal = new FakeModal
      @fakeLog = new FakeLog
      @fakeState = new FakeState
      @fakeDevice = name: "widget", uuid: 1
      @fakePermissionsService = new FakePermissionsService @q
      @fakeDeviceService = new FakeDeviceService @q
      @fakeNotifyService = new FakeNotifyService

      @sut = $controller('DeviceDetailController', {
        $modal : @fakeModal,
        $log : @fakeLog,
        $scope : @scope,
        $state : @fakeState,
        device : @fakeDevice,
        PermissionsService : @fakePermissionsService,
        deviceService : @fakeDeviceService,
        NotifyService : @fakeNotifyService
      })

  beforeEach ->

  it "should exist", =>
    expect(@sut).to.exist

  describe "resetToken", =>
    it "should add a function called resetToken to the scope", =>
      expect(@scope.resetToken).to.exist

    describe "when it is called", =>

      it "should call the confirm modal", =>
        @scope.resetToken()

        expect(@scope.confirmModal).to.have.been.called

      it "should call the confirm modal with text indicating the token will be reset and it's dependencies", =>
        @scope.resetToken()
        expect(@scope.confirmModal).to.have.been.calledWith(@fakeModal, @scope, @fakeLog, "Reset token for widget", "Resetting your token will invalidate the existing token. Are you sure?")

      describe "when the user confirms resetting the token", =>

        it "should call deviceService.resetToken", =>
          @scope.resetToken()
          modalCallback = @scope.confirmModal.args[0][5]
          modalCallback()
          expect(@fakeDeviceService.resetToken).to.have.been.called

        it "should call deviceService.resetToken with the uuid of the device to reset", =>
          @scope.resetToken()
          modalCallback = @scope.confirmModal.args[0][5]
          modalCallback()
          expect(@fakeDeviceService.resetToken).to.have.been.calledWith(@fakeDevice.uuid)

        it "should match the uuid of the device", =>
          @fakeDevice.uuid = 12
          @scope.resetToken()
          modalCallback = @scope.confirmModal.args[0][5]
          modalCallback()
          expect(@fakeDeviceService.resetToken).to.have.been.calledWith(@fakeDevice.uuid)

        it "should notify the user when the token is reset successfully", =>
          @scope.resetToken()
          token = 5
          modalCallback = @scope.confirmModal.args[0][5]
          modalCallback()
          @fakeDeviceService.resetTokenDefer.resolve(5)
          @scope.$digest()

          expect(@fakeNotifyService.alert).to.have.been.calledWith(title: 'Token Reset', content: token )


        it "should notify the user when the token could not be reset", =>
          @fakeDeviceService.resetToken = sinon.stub().returns @q.reject()
          @scope.resetToken()
          modalCallback = @scope.confirmModal.args[0][5]
          modalCallback()
          @scope.$digest()

          expect(@fakeNotifyService.notify).to.have.been.calledWith("Error resetting token")

      describe "when the user cancels the operation", =>
        it "should not call deviceService.resetToken", =>
            @scope.resetToken()
            expect(@fakeDeviceService.resetToken).to.not.have.been.called

        it "should not call NotifyService.notify", =>
            @scope.resetToken()
            expect(@fakeNotifyService.notify).to.not.have.been.called


  class FakeModal

  class FakeLog

  class FakeState

  class FakePermissionsService
    constructor: ($q) ->
      @q = $q

    allSourcePermissions: => @q.defer().promise
    flatSourcePermissions: => @q.defer().promise

    allTargetPermissions: => @q.defer().promise
    flatTargetPermissions: => @q.defer().promise



  class FakeDeviceService
    constructor: ($q) ->
      @q = $q
      @resetToken = sinon.spy(@resetToken)

    resetToken : (uuid) =>
      @resetTokenDefer = @q.defer()
      return @resetTokenDefer.promise

  class FakeNotifyService
    constructor : ->
      @notify = sinon.spy()
      @alert = sinon.spy()

