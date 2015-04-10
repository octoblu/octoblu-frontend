describe 'ThingService', ->
  beforeEach ->
    @skynet = {}
    @skynetService = {}

    module 'octobluApp', ($provide) =>
      $provide.value 'skynetService', @skynetService
      $provide.value 'OCTOBLU_ICON_URL', 's3/'
      return # !important

    inject ($q, $rootScope) =>
      @q = $q
      @rootScope = $rootScope
      @skynetService.getSkynetConnection = => @q.when(@skynet)

    inject (ThingService) =>
      @sut = ThingService

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

      it 'should have everything for receive', ->
        expect(@result.receive).to.deep.equal {'*': true}

    describe 'when called with device that has empty whitelists', ->
      beforeEach ->
        @result = @sut.mapWhitelistsToPermissions {discoverWhitelist: [], receiveWhitelist: [], configureWhitelist: []}
        
      it 'should have an empty object for discover', ->
        expect(@result.discover).to.be.empty

      it 'should have an empty object for configure', ->
        expect(@result.configure).to.be.empty

      it 'should have an empty object for receive', ->
        expect(@result.receive).to.be.empty

    describe 'when called with device that has non-empty whitelists', ->
      beforeEach ->
        device = {
          discoverWhitelist:  ['uuid1']
          receiveWhitelist:   ['uuid2']
          configureWhitelist: ['uuid3']
        }
        @result = @sut.mapWhitelistsToPermissions device
        
      it 'should have an object containing the uuid for discover', ->
        expect(@result.discover).to.deep.equal {'uuid1': true}

      it 'should have an object containing the uuid for receive', ->
        expect(@result.receive).to.deep.equal {'uuid2': true}

      it 'should have an object containing the uuid for configure', ->
        expect(@result.configure).to.deep.equal {'uuid3': true}

      

      
