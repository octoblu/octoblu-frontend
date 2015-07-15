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

  describe '->claimThing', ->
    describe 'when called', ->
      beforeEach (done) ->
        @skynet.devices = sinon.stub().yields {devices: [{type: "gateblu"}]}
        @skynet.update = sinon.stub().yields null

        @user = uuid: 'user-holla'
        @query = uuid: 'holla', token: 'jolla'
        @params = name: 'mokka'

        _.defer => @rootScope.$digest()
        @sut.claimThing(@query, @user, @params).then (@device) => done()

      it 'should call update with the new device properties', ->
        device =
          uuid:  'holla'
          token: 'jolla'
          name:  'mokka'
          owner: 'user-holla'
          discoverWhitelist:  ['user-holla']
          configureWhitelist: ['user-holla']
          sendWhitelist:      ['user-holla']
          receiveWhitelist:   ['user-holla']
        expect(@skynet.update).to.have.been.calledWith device

    describe 'when called and the device already has a whitelist', ->
      beforeEach (done) ->
        @skynet.devices = sinon.stub().yields devices: [{
          discoverWhitelist:  ['other-holla']
          configureWhitelist: ['other-holla']
          sendWhitelist:      ['other-holla']
          receiveWhitelist:   ['other-holla']
        }]
        @skynet.update = sinon.stub().yields null

        @user = uuid: 'user-holla'
        @query = uuid: 'holla', token: 'jolla'
        @params = name: 'mokka'

        _.defer => @rootScope.$digest()
        @sut.claimThing(@query, @user, @params).then (@device) => done()

      it 'should call claimDevice with the new device properties', ->
        device =
          uuid:  'holla'
          token: 'jolla'
          name:  'mokka'
          owner: 'user-holla'
          discoverWhitelist:  ['user-holla', 'other-holla']
          configureWhitelist: ['user-holla', 'other-holla']
          sendWhitelist:      ['user-holla', 'other-holla']
          receiveWhitelist:   ['user-holla', 'other-holla']
        expect(@skynet.update).to.have.been.calledWith device

    describe 'when called without a uuid or token', ->
      beforeEach (done) ->
        @skynet.devices = sinon.spy()
        _.defer => @rootScope.$digest()
        @sut.claimThing().catch (@error) => done()

      it 'should not call skynet.devices', ->
        expect(@skynet.devices).not.to.have.been.called

      it 'should resolve an error', ->
        expect(@error).to.deep.equal 'Unable to claim device, missing uuid'

    describe 'when called with invalid uuid or token', ->
      beforeEach (done) ->
        @skynet.devices = sinon.stub().yields {error: 'nope'}

        @user = uuid: 'user-holla'
        @query = uuid: 'holla', token: 'jolla'
        @params = name: 'mokka'

        _.defer => @rootScope.$digest()
        @sut.claimThing(@query, @user, @params).catch (@error) => done()

      it 'should resolve an error', ->
        expect(@error).to.deep.equal 'nope'

  describe '->combineDeviceWithPeers', ->
    describe 'when called with nothing', ->
      beforeEach ->
        @result = @sut.combineDeviceWithPeers()

      it 'should return nothing', ->
        expect(@result).not.to.exist

    describe 'when called with a device but no peers', ->
      beforeEach ->
        @result = @sut.combineDeviceWithPeers {}, undefined

      it 'should return nothing', ->
        expect(@result).not.to.exist

    describe 'when called with peers, but no device', ->
      beforeEach ->
        @result = @sut.combineDeviceWithPeers undefined, []

      it 'should return nothing', ->
        expect(@result).not.to.exist

    describe 'when called with a device and empty peers', ->
      beforeEach ->
        device = {}
        peers = []
        @result = @sut.combineDeviceWithPeers device, peers

      it 'should return an array containing only everything', ->
        expect(@result).to.have.a.lengthOf 1
        item = _.first @result
        expect(item).to.deep.equal {
          uuid: '*'
          name: 'Everything'
          discover: true
          configure: true
          send: true
          receive: true
        }

    describe 'when called with a device with wildcard discoverWhitelist', ->
      beforeEach ->
        device = {discoverWhitelist: ['*'], configureWhitelist: [], sendWhitelist: [], receiveWhitelist: []}
        peers = []
        @result = @sut.combineDeviceWithPeers device, peers

      it 'should return an array containing only everything', ->
        expect(@result).to.have.a.lengthOf 1
        item = _.first @result
        expect(item).to.deep.equal {
          uuid: '*'
          name: 'Everything'
          discover: true
          configure: false
          send: false
          receive: false
        }

    describe 'when the device has a discoverWhitelist and empty peers', ->
      beforeEach ->
        device = {discoverWhitelist: ['123']}
        peers = []
        @result = @sut.combineDeviceWithPeers device, peers

      it 'should return two things', ->
        expect(@result).to.have.a.lengthOf 2

      it 'should return everything first', ->
        item = _.first @result
        expect(item).to.deep.equal {
          uuid: '*'
          name: 'Everything'
          discover: false
          configure: true
          send: true
          receive: true
        }

      it 'should return the item last, with discover: true', ->
        item = _.last @result
        expect(item).to.deep.equal {
          uuid: '123'
          discover: true
          configure: false
          send: false
          receive: false
        }

    describe 'when the device has a sendWhitelist and empty peers', ->
      beforeEach ->
        device = {sendWhitelist: ['123']}
        peers = []
        @result = @sut.combineDeviceWithPeers device, peers

      it 'should return everything first, with send: false', ->
        item = _.first @result
        expect(item).to.deep.equal {
          uuid: '*'
          name: 'Everything'
          discover: true
          configure: true
          send: false
          receive: true
        }

      it 'should return the item last, with send: true', ->
        item = _.last @result
        expect(item).to.deep.equal {
          uuid: '123'
          discover: false
          configure: false
          send: true
          receive: false
        }

    describe 'when the device is in both send and discover whitelist, empty peers', ->
      beforeEach ->
        device = {discoverWhitelist: ['456'], sendWhitelist: ['456']}
        peers = []
        @result = @sut.combineDeviceWithPeers device, peers

      it 'should return everything first, with send and discover false', ->
        item = _.first @result
        expect(item).to.deep.equal {
          uuid: '*'
          name: 'Everything'
          discover: false
          configure: true
          send: false
          receive: true
        }

      it 'should return the item last, with send and discover: true', ->
        item = _.last @result
        expect(item).to.deep.equal {
          uuid: '456'
          discover: true
          configure: false
          send: true
          receive: false
        }

    describe 'when the device has a sendWhitelist and with corresponding peer', ->
      beforeEach ->
        device = {sendWhitelist: ['123']}
        peers = [{uuid: '123', name: 'Foo', type: 'octoblu:flow'}]
        @result = @sut.combineDeviceWithPeers device, peers

      it 'should return two things', ->
        expect(@result).to.have.a.lengthOf 2

      it 'should merge the device data in', ->
        thing = _.last @result
        expect(thing).to.deep.equal {
          uuid: '123'
          name: 'Foo'
          type: 'octoblu:flow'
          discover: false
          configure: false
          send: true
          receive: false
        }

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

  describe '->getThing', ->
    beforeEach ->
      @skynet.devices = sinon.stub()

    describe 'when devices yields a device', ->
      beforeEach ->
        device = uuid: 'me', name: 'Its Me', type: 'device:me'
        @skynet.devices.yields devices: [device]
        storeResults = (@result) =>
        _.defer => @rootScope.$digest()
        @sut.getThing(uuid: 'me', token: 'no you').then storeResults

      it 'should resolve its promise with that device', ->
        expect(@result.uuid).to.deep.equal 'me'
        expect(@result.name).to.deep.equal 'Its Me'

      it 'should call devices with the uuid and token', ->
        expect(@skynet.devices).to.have.been.calledWith uuid: 'me', token: 'no you'

      it 'should add the logo to me', ->
        expect(@result.logo).to.equal 's3/device/me.svg'

    describe 'when devices yields some device', ->
      beforeEach ->
        devices = [{uuid: 'cool', name: 'Its Cee', type: 'device:cool-beans'}]
        @skynet.devices.yields devices: devices
        storeResults = (@result) =>
        _.defer => @rootScope.$digest()
        @sut.getThing(uuid: 'cool', token: 'yeah').then storeResults

      it 'should call devices with the uuid and token', ->
        expect(@skynet.devices).to.have.been.calledWith uuid: 'cool', token: 'yeah'

      it 'should add the logo to me', ->
        expect(@result.logo).to.equal 's3/device/cool-beans.svg'

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
        expect(_.size @results).to.equal 3

      it 'should have me as the second item', ->
        [me, a, b] = @results
        expect(me.uuid).to.equal 'me'

      it 'should add the logo to me', ->
        [me, a, b] = @results
        expect(me.logo).to.equal 's3/device/user.svg'

    describe 'when mydevices yields some devices', ->
      beforeEach ->
        devices = [{uuid: 'a'}, {uuid: 'b'}, {uuid: 'c', name: 'Its Cee', type: 'device:cool-beans'}]
        @skynet.mydevices.yields devices: devices
        storeResults = (@results) =>
        _.defer => @rootScope.$digest()
        @sut.getThings().then storeResults

      it 'should add the logo to me', ->
        [a, b, c] = @results
        expect(c.logo).to.equal 's3/device/cool-beans.svg'

  describe '->revokeToken', ->
    describe 'when skynet.revokeToken yields null', ->
      beforeEach ->
        @skynet.revokeToken = sinon.stub().yields null

      describe 'when called with a uuid and token', ->
        beforeEach ->
          _.defer => @rootScope.$digest()
          @sut.revokeToken uuid: 'some-uuid', token: 'some-token'
            .catch =>
              @promiseRejected = true

        it 'should call skynet.revokeToken with the uuid and token', ->
          expect(@skynet.revokeToken).to.have.been.calledWith uuid: 'some-uuid', token: 'some-token'

        it 'should reject the promise', ->
          expect(@promiseRejected).to.be.true

    describe 'when skynet.revokeToken yields a uuid', ->
      beforeEach ->
        @skynet.revokeToken = sinon.stub().yields uuid: 'some-uuid'

      describe 'when called with a uuid and token', ->
        beforeEach ->
          _.defer => @rootScope.$digest()
          @sut.revokeToken uuid: 'some-uuid', token: 'some-token'
            .then =>
              @promiseResolved = true

        it 'should call skynet.revokeToken with the uuid and token', ->
          expect(@skynet.revokeToken).to.have.been.calledWith uuid: 'some-uuid', token: 'some-token'

        it 'should resolve the promise', ->
          expect(@promiseResolved).to.be.true

  describe '->updateDeviceWithPermissionRows', ->
    describe 'when skynet.updateDevice yields immediatly', ->
      beforeEach ->
        @skynet.update = sinon.stub().yields {}

      describe 'when called with a device and empty permissions', ->
        beforeEach ->
          device = {uuid: '123'}
          _.defer => @rootScope.$digest()
          @sut.updateDeviceWithPermissionRows device, []

        it 'should call updateDevice with wildcards', ->
          expect(@skynet.update).to.have.been.calledWith {
            uuid: '123'
            discoverWhitelist: []
            configureWhitelist: []
            sendWhitelist: []
            receiveWhitelist: []
          }

      describe 'when called with a device and everything permissions', ->
        beforeEach ->
          device = {uuid: '123'}
          permissions = [{uuid: '*', discover: true, configure: true, send: true, receive: true}]

          _.defer => @rootScope.$digest()
          @sut.updateDeviceWithPermissionRows device, permissions

        it 'should call updateDevice with wildcards', ->
          expect(@skynet.update).to.have.been.calledWith {
            uuid: '123'
            discoverWhitelist: ['*']
            configureWhitelist: ['*']
            sendWhitelist: ['*']
            receiveWhitelist: ['*']
          }

      describe 'when called with a device and something can discover', ->
        beforeEach ->
          device = {uuid: '123'}
          permissions = [{uuid: 'something', discover: true, configure: false, send: false, receive: false}]

          _.defer => @rootScope.$digest()
          @sut.updateDeviceWithPermissionRows device, permissions

        it 'should call updateDevice with wildcards', ->
          expect(@skynet.update).to.have.been.calledWith {
            uuid: '123'
            discoverWhitelist: ['something']
            configureWhitelist: []
            sendWhitelist: []
            receiveWhitelist: []
          }
