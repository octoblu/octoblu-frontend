describe 'ThingService', ->
  beforeEach ->
    @skynet = {}
    @skynetService = {}

    module 'octobluApp', ($provide) =>
      $provide.value 'skynetService', @skynetService
      $provide.constant 'OCTOBLU_ICON_URL', 's3/'
      return # !important

    inject ($q, $rootScope) =>
      @q = $q
      @rootScope = $rootScope
      @skynetService.getSkynetConnection = => @q.when(@skynet)

    inject (ThingService) =>
      @sut = ThingService

  describe '->deleteThing', ->
    describe 'when called with a device', ->
      beforeEach ->
        @skynet.unregister = sinon.stub().yields =>
        _.defer => @rootScope.$digest()
        @sut.deleteThing(uuid: 'nuc')

      it 'should call unregister with the uuid', ->
        expect(@skynet.unregister).to.have.been.calledWith uuid: 'nuc'

    describe 'when called with a different device', ->
      beforeEach ->
        @skynet.unregister = sinon.stub().yields =>
        _.defer => @rootScope.$digest()
        @sut.deleteThing(uuid: 'what-will')

      it 'should call unregister with the uuid', ->
        expect(@skynet.unregister).to.have.been.calledWith uuid: 'what-will'

  describe '->generateSessionToken', ->
    describe 'when called with a device and meshblu responds with a token', ->
      beforeEach ->
        @skynet.generateAndStoreToken = sinon.stub().yields token: 'has-a'
        _.defer => @rootScope.$digest()

        storeResult = (@result) =>
        @sut.generateSessionToken({uuid: 'every-sip'}).then storeResult

      it 'should call generateAndStoreToken', ->
        expect(@skynet.generateAndStoreToken).to.have.been.calledWith uuid: 'every-sip'

      it 'should resolve with the token', ->
        expect(@result).to.equal 'has-a'

    describe 'when called with a different device', ->
      beforeEach ->
        @skynet.generateAndStoreToken = sinon.stub().yields token: 'sweet'
        _.defer => @rootScope.$digest()
        storeResult = (@result) =>
        @sut.generateSessionToken({uuid: 'sweet-ending'}).then storeResult

      it 'should call generateAndStoreToken', ->
        expect(@skynet.generateAndStoreToken).to.have.been.calledWith uuid: 'sweet-ending'

      it 'should resolve with the token', ->
        expect(@result).to.equal 'sweet'

  describe '->getThings', ->
    beforeEach ->
      @skynet.mydevices = sinon.stub()

    describe 'when mydevices yields some devices', ->
      beforeEach ->
        devices = [{uuid: 'a'}, {uuid: 'b'}, {uuid: 'me', name: 'Its Me', type: 'octoblu:user'}]
        @skynet.mydevices.yields devices: devices
        storeResults = (@results) =>
        _.defer => @rootScope.$digest()
        @sut.getThings().then storeResults

      it 'should resolve its promise with those devices', ->
        expect(_.size @results).to.equal 4

      it 'should have everything as the first item', ->
        [everything, me, a, b] = @results
        expect(everything.uuid).to.equal '*'

      it 'should have me as the second item', ->
        [everything, me, a, b] = @results
        expect(me.uuid).to.equal 'me'

      it 'should add the logo to me', ->
        [everything, me, a, b] = @results
        expect(me.logo).to.equal 's3/device/user.svg'

    describe 'when mydevices yields some devices', ->
      beforeEach ->
        devices = [{uuid: 'a'}, {uuid: 'b'}, {uuid: 'c', name: 'Its Cee', type: 'device:cool-beans'}]
        @skynet.mydevices.yields devices: devices
        storeResults = (@results) =>
        _.defer => @rootScope.$digest()
        @sut.getThings().then storeResults

      it 'should add the logo to me', ->
        [everything, a, b, c] = @results
        expect(c.logo).to.equal 's3/device/cool-beans.svg'

  describe '->mapWhitelistsToPermissions', ->
    describe 'when called with no device', ->
      beforeEach ->
        @result = @sut.mapWhitelistsToPermissions()

      it 'should return null', ->
        expect(@result).to.be.null

    describe 'when called with a device that has no whitelists', ->
      beforeEach ->
        @result = @sut.mapWhitelistsToPermissions {}

      it 'should have everything for discover', ->
        expect(@result.discover).to.deep.equal {'*': true}

      it 'should have everything for configure', ->
        expect(@result.configure).to.deep.equal {'*': true}

      it 'should have everything for send', ->
        expect(@result.send).to.deep.equal {'*': true}

    describe 'when called with device that has empty whitelists', ->
      beforeEach ->
        @result = @sut.mapWhitelistsToPermissions {discoverWhitelist: [], sendWhitelist: [], configureWhitelist: [], receiveWhitelist: []}

      it 'should have an empty object for discover', ->
        expect(@result.discover).to.be.empty

      it 'should have an empty object for configure', ->
        expect(@result.configure).to.be.empty

      it 'should have an empty object for send', ->
        expect(@result.send).to.be.empty

      it 'should have an empty object for receive', ->
        expect(@result.receive).to.be.empty

    describe 'when called with device that has non-empty whitelists', ->
      beforeEach ->
        device = {
          discoverWhitelist:  ['uuid1']
          sendWhitelist:   ['uuid2']
          configureWhitelist: ['uuid3']
          receiveWhitelist: ['uuid4']
        }
        @result = @sut.mapWhitelistsToPermissions device

      it 'should have an object containing the uuid for discover', ->
        expect(@result.discover).to.deep.equal {'uuid1': true}

      it 'should have an object containing the uuid for send', ->
        expect(@result.send).to.deep.equal {'uuid2': true}

      it 'should have an object containing the uuid for configure', ->
        expect(@result.configure).to.deep.equal {'uuid3': true}

      it 'should have an object containing the uuid for receive', ->
        expect(@result.receive).to.deep.equal {'uuid4': true}

  describe '->updateDeviceWithPermissions', ->
    describe 'when update yields immediatly', ->
      beforeEach ->
        @skynet.update = sinon.stub().yields {}

      it 'should be a function that returns a promise', ->
        _.defer => @rootScope.$digest()
        @sut.updateDeviceWithPermissions().then =>

      describe 'when called with a device and empty permissions', ->
        beforeEach ->
          _.defer => @rootScope.$digest()

          device      = {uuid: '12'}
          permissions = {discover: {}, configure: {}, send: {}, receive: {}}

          @sut.updateDeviceWithPermissions device, permissions

        it 'should call update with empty whitelists', ->
          expect(@skynet.update).to.have.been.calledWith {
            uuid: '12'
            discoverWhitelist: []
            configureWhitelist: []
            sendWhitelist: []
            receiveWhitelist: []
          }

      describe 'when called with device and everything permissions', ->
        beforeEach ->
          _.defer => @rootScope.$digest()

          device = uuid: '13'
          permissions =
            discover:
              '*': true
            configure:
              '*': true
            send:
              '*': true
            receive:
              '*': true

          @sut.updateDeviceWithPermissions device, permissions

        it 'should call update on the skynet connection with the device', ->
          expect(@skynet.update).to.have.been.calledWith {
            uuid: '13'
            discoverWhitelist: ['*']
            configureWhitelist: ['*']
            sendWhitelist: ['*']
            receiveWhitelist: ['*']
          }

      describe 'when called with device and the permissions are false', ->
        beforeEach ->
          _.defer => @rootScope.$digest()

          device = uuid: '13'
          permissions =
            discover:
              '1': false
            configure:
              '1': false
            send:
              '1': false
            receive:
              '1': false

          @sut.updateDeviceWithPermissions device, permissions

        it 'should call update on the skynet connection with the device', ->
          expect(@skynet.update).to.have.been.calledWith {
            uuid: '13'
            discoverWhitelist: []
            configureWhitelist: []
            sendWhitelist: []
            receiveWhitelist: []
          }
