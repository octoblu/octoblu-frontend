describe 'OctoService', ->
  beforeEach ->
    @skynetService =
      sendMessage: sinon.spy()

    @deviceService = {}

    @cookies = {}

    module 'octobluApp', ($provide) =>
      $provide.value 'skynetService', @skynetService
      $provide.value 'deviceService', @deviceService
      $provide.value '$cookies', @cookies
      $provide.value 'OCTO_MASTER_UUID', 'octo-master'
      return

    inject ($q, $rootScope, OctoService) =>
      @q = $q
      @rootScope = $rootScope
      @sut = OctoService

  it 'should exist', ->
    expect(@sut).to.exist

  xdescribe '->list', ->
    beforeEach ->
      _.defer => @rootScope.$digest()
      @sut.list().then (@octos) =>

    it 'should resolve a list of octo-owls', ->
      expect(@octos).to.deep.equal [{}, {}]

  describe '->add', ->
    describe 'when called with a octoblu-user', ->
      beforeEach ->
        device = uuid: 'some-super-uuid', token: 'some-super-token'
        @deviceService.registerDevice = sinon.stub().returns @q.when(device)
        @cookies.meshblu_auth_uuid = 'octoblu-user'
        _.defer => @rootScope.$digest()
        @sut.add()

      it 'should call deviceService.registerDevice with the device properties', ->
        deviceProperties =
          type: 'octoblu:octo'
          discoverWhitelist: ['octoblu-user']
          configureWhitelist: ['octoblu-user']
          receiveWhitelist: ['*']
          sendWhitelist: ['octoblu-user']
        expect(@deviceService.registerDevice).to.have.been.calledWith deviceProperties

      it 'should send a meshblu message to the octo manager with a device', ->
        deviceMessage =
          devices: 'octo-master'
          topic: 'add-octo'
          payload:
            uuid: 'some-super-uuid'
            token: 'some-super-token'
        expect(@skynetService.sendMessage).to.have.been.calledWith deviceMessage

    describe 'when called a different octoblu-user', ->
      beforeEach ->
        device = uuid: 'some-lame-uuid', token: 'some-lame-token'
        @deviceService.registerDevice = sinon.stub().returns @q.when(device)
        @cookies.meshblu_auth_uuid = 'amazing-user'
        _.defer => @rootScope.$digest()
        @sut.add()

      it 'should call deviceService.registerDevice with the device properties', ->
        deviceProperties =
          type: 'octoblu:octo'
          discoverWhitelist: ['amazing-user']
          configureWhitelist: ['amazing-user']
          receiveWhitelist: ['*']
          sendWhitelist: ['amazing-user']
        expect(@deviceService.registerDevice).to.have.been.calledWith deviceProperties

      it 'should send a meshblu message to the octo manager with a device', ->
        deviceMessage =
          devices: 'octo-master'
          topic: 'add-octo'
          payload:
            uuid: 'some-lame-uuid'
            token: 'some-lame-token'
        expect(@skynetService.sendMessage).to.have.been.calledWith deviceMessage

  describe '->remove', ->
    describe 'when called with a octoblu-user', ->
      beforeEach ->
        @deviceService.resetToken = sinon.stub().returns @q.when()
        @cookies.meshblu_auth_uuid = 'octoblu-user'
        _.defer => @rootScope.$digest()
        @sut.remove(uuid: 'some-super-uuid')

      it 'should reset the device', ->
        expect(@deviceService.resetToken).to.have.been.calledWith 'some-super-uuid'

      it 'should send a meshblu message to the octo manager with a device', ->
        deviceMessage =
          devices: 'octo-master'
          topic: 'remove-octo'
          payload:
            uuid: 'some-super-uuid'

        expect(@skynetService.sendMessage).to.have.been.calledWith deviceMessage

    describe 'when called a different octoblu-user', ->
      beforeEach ->
        @deviceService.resetToken = sinon.stub().returns @q.when()
        @cookies.meshblu_auth_uuid = 'amazing-user'
        _.defer => @rootScope.$digest()
        @sut.remove(uuid: 'some-lame-uuid')

      it 'should reset the device', ->
        expect(@deviceService.resetToken).to.have.been.calledWith 'some-lame-uuid'

      it 'should send a meshblu message to the octo manager with a device', ->
        deviceMessage =
          devices: 'octo-master'
          topic: 'remove-octo'
          payload:
            uuid: 'some-lame-uuid'

        expect(@skynetService.sendMessage).to.have.been.calledWith deviceMessage
