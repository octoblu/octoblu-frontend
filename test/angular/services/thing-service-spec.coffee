describe 'ThingService', ->
  beforeEach ->
    @cookies = {}
    module 'octobluApp', ($provide) =>
      $provide.value '$cookies', @cookies
      $provide.constant 'OCTOBLU_ICON_URL', 's3/'
      return # !important

    inject ($q, $rootScope, MeshbluHttpService) =>
      @q = $q
      @rootScope = $rootScope
      @MeshbluHttpService = MeshbluHttpService


    inject (ThingService) =>
      @sut = ThingService

  describe '->claimThing', ->
    describe 'when called', ->
      beforeEach (done) ->
        @user = uuid: 'user-holla'
        @query = uuid: 'holla', token: 'jolla'
        @params = name: 'mokka'
        @meshbluHttp = {
          whoami: sinon.stub().yields null, {type: "gateblu"}
          update: sinon.stub().yields null
        }
        @sut.MeshbluHttp = () => @meshbluHttp

        _.defer => @rootScope.$digest()
        @sut.claimThing(@query, @user, @params).then (@device) => done()
        return

      it 'should call update with the new device properties', ->
        device =
          name:  'mokka'
          owner: 'user-holla'
          discoverWhitelist:  ['user-holla']
          configureWhitelist: ['user-holla']
          sendWhitelist:      ['user-holla']
          receiveWhitelist:   ['user-holla']
        expect(@meshbluHttp.update).to.have.been.calledWith 'holla', device

    describe 'when called and the device already has a whitelist', ->
      beforeEach (done) ->
        @user = uuid: 'user-holla'
        @query = uuid: 'holla', token: 'jolla'
        @params = name: 'mokka'
        @meshbluHttp = {
          whoami: sinon.stub().yields null, {
            discoverWhitelist:  ['other-holla']
            configureWhitelist: ['other-holla']
            sendWhitelist:      ['other-holla']
            receiveWhitelist:   ['other-holla']
          }
          update: sinon.stub().yields null
        }
        @sut.MeshbluHttp = () => @meshbluHttp
        _.defer => @rootScope.$digest()
        @sut.claimThing(@query, @user, @params).then (@device) => done()
        return

      it 'should call claimDevice with the new device properties', ->
        device =
          name:  'mokka'
          owner: 'user-holla'
          discoverWhitelist:  ['user-holla', 'other-holla']
          configureWhitelist: ['user-holla', 'other-holla']
          sendWhitelist:      ['user-holla', 'other-holla']
          receiveWhitelist:   ['user-holla', 'other-holla']
        expect(@meshbluHttp.update).to.have.been.calledWith 'holla', device

    describe 'when called with 2.0.0 device', ->
      beforeEach (done) ->
        @user = uuid: 'user-holla'
        @query = uuid: 'holla', token: 'jolla'
        @params = name: 'mokka'
        @meshbluHttp = {
          whoami: sinon.stub().yields null, {
            meshblu:
              version: '2.0.0'
          }
          update: sinon.stub().yields null
        }
        @sut.MeshbluHttp = () => @meshbluHttp
        _.defer => @rootScope.$digest()
        @sut.claimThing(@query, @user, @params).then (@device) => done()
        return

      it 'should call claimDevice with the new device properties', ->
        device =
          name:  'mokka'
          owner: 'user-holla'
          'meshblu.whitelists.broadcast.as': []
          'meshblu.whitelists.broadcast.received': []
          'meshblu.whitelists.broadcast.sent': []
          'meshblu.whitelists.configure.as': []
          'meshblu.whitelists.configure.received': []
          'meshblu.whitelists.configure.sent': []
          'meshblu.whitelists.configure.update': [
            { uuid: 'user-holla' }
          ]
          'meshblu.whitelists.discover.as': []
          'meshblu.whitelists.discover.view': [
            { uuid: 'user-holla' }
          ]
          'meshblu.whitelists.message.as': []
          'meshblu.whitelists.message.from': []
          'meshblu.whitelists.message.received': []
          'meshblu.whitelists.message.sent': []
        expect(@meshbluHttp.update).to.have.been.calledWith 'holla', device

    describe 'when called with 2.0.0 device and it has existing whitelists', ->
      beforeEach (done) ->
        @user = uuid: 'user-holla'
        @query = uuid: 'holla', token: 'jolla'
        @params = name: 'mokka'
        @meshbluHttp = {
          whoami: sinon.stub().yields null, {
            owner: 'some-owner'
            meshblu:
              version: '2.0.0'
              something: 'else'
              whitelists:
                discover:
                  view: [
                    { uuid: '*' }
                    { uuid: 'other-holla' }
                  ]
                configure:
                  update: [
                    { uuid: 'other-holla' }
                  ]
          }
          update: sinon.stub().yields null
        }
        @sut.MeshbluHttp = () => @meshbluHttp
        _.defer => @rootScope.$digest()
        @sut.claimThing(@query, @user, @params).then (@device) => done()
        return

      it 'should call claimDevice with the new device properties', ->
        device =
          name:  'mokka'
          owner: 'user-holla'
          'meshblu.whitelists.broadcast.as': []
          'meshblu.whitelists.broadcast.received': []
          'meshblu.whitelists.broadcast.sent': []
          'meshblu.whitelists.configure.as': []
          'meshblu.whitelists.configure.received': []
          'meshblu.whitelists.configure.sent': []
          'meshblu.whitelists.configure.update': [
            { uuid: 'other-holla' }
            { uuid: 'user-holla' }
          ]
          'meshblu.whitelists.discover.as': []
          'meshblu.whitelists.discover.view': [
            { uuid: 'other-holla' }
            { uuid: 'user-holla' }
          ]
          'meshblu.whitelists.message.as': []
          'meshblu.whitelists.message.from': []
          'meshblu.whitelists.message.received': []
          'meshblu.whitelists.message.sent': []

        expect(@meshbluHttp.update).to.have.been.calledWith 'holla', device

    describe 'when called without a uuid or token', ->
      beforeEach (done) ->
        @MeshbluHttpService.devices = sinon.spy()
        _.defer => @rootScope.$digest()
        @meshbluHttp = {
          whoami: sinon.stub().yields null, {}
          update: sinon.stub().yields null
        }
        @sut.MeshbluHttp = () => @meshbluHttp
        @sut.claimThing().catch (@error) => done()
        return

      it 'should not call whoami', ->
        expect(@meshbluHttp.whoami).not.to.have.been.called

      it 'should resolve an error', ->
        expect(@error).to.deep.equal 'Unable to claim device, missing uuid'

    describe 'when called with invalid uuid or token', ->
      beforeEach (done) ->
        @MeshbluHttpService.devices = sinon.stub().yields new Error('nope')

        @user = uuid: 'user-holla'
        @query = uuid: 'holla', token: 'jolla'
        @params = name: 'mokka'
        @meshbluHttp = {
          whoami: sinon.stub().yields 'nope'
          update: sinon.stub().yields null
        }
        @sut.MeshbluHttp = () => @meshbluHttp
        _.defer => @rootScope.$digest()
        @sut.claimThing(@query, @user, @params).catch (@error) => done()
        return

      it 'should not call whoami', ->
        expect(@meshbluHttp.whoami).to.have.been.called

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
          type: 'Octoblu'
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
          type: 'Octoblu'
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
          type: 'Octoblu'
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
          type: 'Octoblu'
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
          type: 'Octoblu'
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
        @MeshbluHttpService.unregister = sinon.stub().yields null
        _.defer => @rootScope.$digest()
        @sut.deleteThing(uuid: 'nuc')

      it 'should call unregister with the uuid', ->
        expect(@MeshbluHttpService.unregister).to.have.been.calledWith 'nuc'

    describe 'when called with a different device', ->
      beforeEach ->
        @MeshbluHttpService.unregister = sinon.stub().yields null
        _.defer => @rootScope.$digest()
        @sut.deleteThing(uuid: 'what-will')

      it 'should call unregister with the uuid', ->
        expect(@MeshbluHttpService.unregister).to.have.been.calledWith 'what-will'

  describe '->generateSessionToken', ->
    describe 'when called with a device and meshblu responds with a token', ->
      beforeEach ->
        @MeshbluHttpService.generateAndStoreToken = sinon.stub().yields null, 'has-a'
        _.defer => @rootScope.$digest()

        storeResult = (@result) =>
        @sut.generateSessionToken({uuid: 'every-sip'}).then storeResult

      it 'should call generateAndStoreToken', ->
        expect(@MeshbluHttpService.generateAndStoreToken).to.have.been.calledWith 'every-sip'

      it 'should resolve with the token', ->
        expect(@result).to.equal 'has-a'

    describe 'when called with a different device', ->
      beforeEach ->
        @MeshbluHttpService.generateAndStoreToken = sinon.stub().yields null, 'sweet'
        _.defer => @rootScope.$digest()
        storeResult = (@result) =>
        @sut.generateSessionToken({uuid: 'sweet-ending'}).then storeResult

      it 'should call generateAndStoreToken', ->
        expect(@MeshbluHttpService.generateAndStoreToken).to.have.been.calledWith 'sweet-ending'

      it 'should resolve with the token', ->
        expect(@result).to.equal 'sweet'

  describe '->getThing', ->
    beforeEach ->
      @MeshbluHttpService.device = sinon.stub()

    describe 'when devices yields a device', ->
      beforeEach ->
        device = uuid: 'me', name: 'Its Me', type: 'device:me'
        @MeshbluHttpService.device.yields null, device
        storeResults = (@result) =>
        _.defer => @rootScope.$digest()
        @sut.getThing(uuid: 'me', token: 'no you').then storeResults

      it 'should resolve its promise with that device', ->
        expect(@result.uuid).to.deep.equal 'me'
        expect(@result.name).to.deep.equal 'Its Me'

      it 'should call devices with the uuid and token', ->
        expect(@MeshbluHttpService.device).to.have.been.calledWith 'me'

      it 'should add the logo to me', ->
        expect(@result.logo).to.equal 's3/device/me.svg'

    describe 'when devices yields some device', ->
      beforeEach ->
        device = {uuid: 'cool', name: 'Its Cee', type: 'device:cool-beans'}
        @MeshbluHttpService.device.yields null, device
        storeResults = (@result) =>
        _.defer => @rootScope.$digest()
        @sut.getThing(uuid: 'cool', token: 'yeah').then storeResults

      it 'should call devices with the uuid and token', ->
        expect(@MeshbluHttpService.device).to.have.been.calledWith 'cool'

      it 'should add the logo to me', ->
        expect(@result.logo).to.equal 's3/device/cool-beans.svg'

  describe '->getThings', ->
    beforeEach ->
      @MeshbluHttpService.search = sinon.stub()

    describe 'when devices yields some devices', ->
      beforeEach ->
        devices = [{uuid: 'a'}, {uuid: 'b'}, {uuid: 'me', name: 'Its Me', type: 'octoblu:user'}]
        @MeshbluHttpService.search.yields null, devices
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

    describe 'when devices yields some devices', ->
      beforeEach ->
        devices = [{uuid: 'a'}, {uuid: 'b'}, {uuid: 'c', name: 'Its Cee', type: 'device:cool-beans'}]
        @MeshbluHttpService.search.yields null, devices
        storeResults = (@results) =>
        _.defer => @rootScope.$digest()
        @sut.getThings().then storeResults

      it 'should add the logo to me', ->
        [a, b, c] = @results
        expect(c.logo).to.equal 's3/device/cool-beans.svg'

  describe '->revokeToken', ->
    describe 'when MeshbluHttpService.revokeToken yields an error', ->
      beforeEach ->
        @MeshbluHttpService.revokeToken = sinon.stub().yields new Error()

      describe 'when called with a uuid and token', ->
        beforeEach ->
          _.defer => @rootScope.$digest()
          @sut.revokeToken uuid: 'some-uuid', token: 'some-token'
            .catch =>
              @promiseRejected = true

        it 'should call MeshbluHttpService.revokeToken with the uuid and token', ->
          expect(@MeshbluHttpService.revokeToken).to.have.been.calledWith uuid: 'some-uuid', token: 'some-token'

        it 'should reject the promise', ->
          expect(@promiseRejected).to.be.true

    describe 'when MeshbluHttpService.revokeToken yields a uuid', ->
      beforeEach ->
        @MeshbluHttpService.revokeToken = sinon.stub().yields null, uuid: 'some-uuid'

      describe 'when called with a uuid and token', ->
        beforeEach ->
          _.defer => @rootScope.$digest()
          @sut.revokeToken uuid: 'some-uuid', token: 'some-token'
            .then =>
              @promiseResolved = true

        it 'should call MeshbluHttpService.revokeToken with the uuid and token', ->
          expect(@MeshbluHttpService.revokeToken).to.have.been.calledWith uuid: 'some-uuid', token: 'some-token'

        it 'should resolve the promise', ->
          expect(@promiseResolved).to.be.true

  describe '->updateDeviceWithPermissionRows', ->
    describe 'when MeshbluHttpService.updateDevice yields immediatly', ->
      beforeEach ->
        @MeshbluHttpService.update = sinon.stub().yields null

      describe 'when called with a device and empty permissions', ->
        beforeEach ->
          device = {uuid: '123'}
          _.defer => @rootScope.$digest()
          @sut.updateDeviceWithPermissionRows device, []

        it 'should call updateDevice with wildcards', ->
          expect(@MeshbluHttpService.update).to.have.been.calledWith '123', {
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
          expect(@MeshbluHttpService.update).to.have.been.calledWith '123', {
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
          expect(@MeshbluHttpService.update).to.have.been.calledWith '123', {
            uuid: '123'
            discoverWhitelist: ['something']
            configureWhitelist: []
            sendWhitelist: []
            receiveWhitelist: []
          }
