describe 'ClaimNodeController', ->
  beforeEach ->
    module 'octobluApp'

    inject ($controller, $rootScope, $q) =>
      @q = $q
      @rootScope = $rootScope
      @stateParams = {}
      @ThingService =
        getThing: sinon.stub()
        revokeToken: sinon.stub()
        updateDevice: sinon.stub()
      @state =
        go: sinon.spy()
      @cookies = {}
      @scope = $rootScope.$new()
      @controllerParams =
        $scope: @scope
        $stateParams: @stateParams
        $state: @state
        $q: @q
        $cookies: @cookies
        ThingService: @ThingService

      @controller = $controller

  describe '->constructor', ->
    describe 'when called getDevice is successful', ->
      beforeEach (done) ->
        @stateParams.uuid = 'working'
        @stateParams.token = 'token'
        @ThingService.getThing.returns @q.when uuid: 'working'
        _.defer => @rootScope.$digest()
        @sut = @controller 'ClaimNodeController', @controllerParams
        _.delay done, 100

      it 'should set the device on the controller', ->
        expect(@sut.device).to.deep.equal uuid: 'working'

    describe 'when called getDevice is failed', ->
      beforeEach (done) ->
        @stateParams.uuid = 'invalid uuid'
        @stateParams.token = 'invalid token'
        @ThingService.getThing.returns @q.reject 'invalid device'
        _.defer => @rootScope.$digest()
        @sut = @controller 'ClaimNodeController', @controllerParams
        _.delay done, 100

      it 'should set the device on the controller', ->
        expect(@sut.errorMessage).to.deep.equal 'invalid device'

    describe 'when called there is no uuid', ->
      beforeEach (done) ->
        _.defer => @rootScope.$digest()
        @sut = @controller 'ClaimNodeController', @controllerParams
        _.delay done, 100

      it 'should set the device on the controller', ->
        expect(@sut.errorMessage).to.deep.equal 'Unable to retrieve device, missing uuid'

  describe '->getDevice', ->
    beforeEach ->
      @sut = @controller 'ClaimNodeController', @controllerParams

    describe 'when called', ->
      beforeEach (done) ->
        @stateParams.uuid = 'holla'
        @stateParams.token = 'wolla'
        device = uuid: 'holla', type: 'sweet'
        @ThingService.getThing.returns @q.when device
        _.defer => @rootScope.$digest()
        @sut.getDevice().then (@device) => done()

      it 'should call getThing with the uuid', ->
        expect(@ThingService.getThing).to.have.been.calledWith uuid: 'holla', token: 'wolla'

      it 'should resolve a device', ->
        expect(@device).to.deep.equal uuid: 'holla', type: 'sweet'

    describe 'when called with a different device', ->
      beforeEach (done) ->
        @stateParams.uuid = 'molla'
        @stateParams.token = 'tolla'
        device = uuid: 'molla', type: 'mweet'
        @ThingService.getThing.returns @q.when device
        _.defer => @rootScope.$digest()
        @sut.getDevice().then (@device) => done()

      it 'should call getThing with the uuid', ->
        expect(@ThingService.getThing).to.have.been.calledWith uuid: 'molla', token: 'tolla'

      it 'should resolve a device', ->
        expect(@device).to.deep.equal uuid: 'molla', type: 'mweet'

    describe 'when called without a uuid', ->
      beforeEach (done) ->
        _.defer => @rootScope.$digest()
        @sut.getDevice().catch (@error) => done()

      it 'should not call updateDevice', ->
        expect(@ThingService.updateDevice).to.not.have.been.called

      it 'should resolve a device', ->
        expect(@error).to.deep.equal 'Unable to retrieve device, missing uuid'

    describe 'when called without a token', ->
      beforeEach (done) ->
        _.defer => @rootScope.$digest()
        @stateParams.uuid = 'sweet-bacon'
        @sut.getDevice().catch (@error) => done()

      it 'should not call updateDevice', ->
        expect(@ThingService.updateDevice).to.not.have.been.called

      it 'should resolve a device', ->
        expect(@error).to.deep.equal 'Unable to retrieve device, missing token'

    describe 'when called with invalid uuid or token', ->
      beforeEach (done) ->
        @stateParams.uuid = 'tolla'
        @stateParams.token = 'lolla'
        @ThingService.getThing.returns @q.reject 'Invalid device'
        _.defer => @rootScope.$digest()
        @sut.getDevice().catch (@error) => done()

      it 'should call getThing with the uuid', ->
        expect(@ThingService.getThing).to.have.been.calledWith uuid: 'tolla', token: 'lolla'

      it 'should resolve a device', ->
        expect(@error).to.deep.equal 'Invalid device'

  describe '->claimDevice', ->
    beforeEach ->
      @ThingService.revokeToken.returns @q.when {}
      @sut = @controller 'ClaimNodeController', @controllerParams

    describe 'when called', ->
      beforeEach (done) ->
        @sut.device = {}
        @sut.deviceName = 'mokka'
        @cookies.meshblu_auth_uuid = 'user-holla'
        @stateParams.uuid = 'holla'
        @stateParams.token = 'jolla'
        @ThingService.updateDevice.returns @q.when null
        _.defer => @rootScope.$digest()
        @sut.device = {}
        @sut.claimDevice().then (@device) => done()

      it 'should call claimDevice with the new device properties', ->
        device =
          uuid: 'holla'
          token: 'jolla'
          name: 'mokka'
          owner: 'user-holla'
          discoverWhitelist: [
            'user-holla'
          ]
          configureWhitelist: [
            'user-holla'
          ]
          sendWhitelist: [
            'user-holla'
          ]
          receiveWhitelist: [
            'user-holla'
          ]
        expect(@ThingService.updateDevice).to.have.been.calledWith device

      it 'should call ThingService.revokeToken with uuid and token', ->
        expect(@ThingService.revokeToken).to.have.been.calledWith uuid: 'holla', token: 'jolla'

    describe 'when called and the device already has a whitelist', ->
      beforeEach (done) ->
        @sut.device = {}
        @sut.deviceName = 'mokka'
        @sut.device =
          discoverWhitelist: [
            'other-holla'
          ]
          configureWhitelist: [
            'other-holla'
          ]
          sendWhitelist: [
            'other-holla'
          ]
          receiveWhitelist: [
            'other-holla'
          ]
        @cookies.meshblu_auth_uuid = 'user-holla'
        @stateParams.uuid = 'holla'
        @stateParams.token = 'jolla'
        @ThingService.updateDevice.returns @q.when null
        _.defer => @rootScope.$digest()
        @sut.claimDevice().then (@device) => done()

      it 'should call claimDevice with the new device properties', ->
        device =
          uuid: 'holla'
          token: 'jolla'
          name: 'mokka'
          owner: 'user-holla'
          discoverWhitelist: [
            'user-holla'
            'other-holla'
          ]
          configureWhitelist: [
            'user-holla'
            'other-holla'
          ]
          sendWhitelist: [
            'user-holla'
            'other-holla'
          ]
          receiveWhitelist: [
            'user-holla'
            'other-holla'
          ]
        expect(@ThingService.updateDevice).to.have.been.calledWith device

      it 'should call ThingService.revokeToken with uuid and token', ->
        expect(@ThingService.revokeToken).to.have.been.calledWith uuid: 'holla', token: 'jolla'

    describe 'when called without a uuid or token', ->
      beforeEach (done) ->
        _.defer => @rootScope.$digest()
        @sut.claimDevice().catch (@error) => done()

      it 'should call claimDevice with the uuid', ->
        expect(@ThingService.updateDevice).to.not.have.been.called

      it 'should resolve a device', ->
        expect(@error).to.deep.equal 'Unable to claim device, missing uuid'

    describe 'when called with invalid uuid or token', ->
      beforeEach (done) ->
        @sut.device = {}
        @sut.deviceName = 'pokka'
        @stateParams.uuid = 'molla'
        @stateParams.token = 'lolla'
        @ThingService.updateDevice.returns @q.reject 'Invalid device'
        _.defer => @rootScope.$digest()
        @sut.claimDevice().catch (@error) => done()

      it 'should call claimDevice with the uuid', ->
        expect(@ThingService.updateDevice.firstCall.args[0].uuid).to.deep.equal 'molla'

      it 'should resolve a device', ->
        expect(@error).to.deep.equal 'Invalid device'
