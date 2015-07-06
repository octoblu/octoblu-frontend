describe 'ClaimNodeController', ->
  beforeEach ->
    @fakeSkynetService = {}
    @fakeSkynetConnection =
      mydevices: sinon.spy()
      unclaimeddevices: sinon.stub()
      on: sinon.spy()
    module 'octobluApp', ($provide) =>
      $provide.value 'skynetService', @fakeSkynetService
      $provide.value 'reservedProperties', ['$$hashKey', '_id']
      return

    inject ($controller, $rootScope, $q) =>
      @q = $q
      @rootScope = $rootScope
      @deviceService =
        claimDevice: sinon.stub()
        getUnclaimedNodes: sinon.stub()
      @stateParams = {}
      @state =
        go: sinon.spy()
      @scope = $rootScope.$new()
      @fakeSkynetService.getSkynetConnection = sinon.stub().returns @q.when @fakeSkynetConnection
      @controller = $controller

  describe '->constructor', ->
    describe 'when called getDevice is successful', ->
      beforeEach (done) ->
        @stateParams.uuid = 'working'
        @deviceService.getUnclaimedNodes.returns @q.when [uuid: 'working']
        params = $scope: @scope, $stateParams: @stateParams, $state: @state, $q: @q, deviceService: @deviceService
        _.defer => @rootScope.$digest()
        @sut = @controller 'ClaimNodeController', params
        _.delay done, 100

      it 'should set the device on the controller', ->
        expect(@sut.device).to.deep.equal uuid: 'working'

    describe 'when called getDevice is failed', ->
      beforeEach (done) ->
        @stateParams.uuid = 'invalid device'
        @deviceService.getUnclaimedNodes.returns @q.reject 'invalid device'
        params = $scope: @scope, $stateParams: @stateParams, $state: @state, $q: @q, deviceService: @deviceService
        _.defer => @rootScope.$digest()
        @sut = @controller 'ClaimNodeController', params
        _.delay done, 100

      it 'should set the device on the controller', ->
        expect(@sut.errorMessage).to.deep.equal 'invalid device'

    describe 'when called there is no uuid', ->
      beforeEach (done) ->
        params = $scope: @scope, $stateParams: @stateParams, $state: @state, $q: @q, deviceService: @deviceService
        _.defer => @rootScope.$digest()
        @sut = @controller 'ClaimNodeController', params
        _.delay done, 100

      it 'should set the device on the controller', ->
        expect(@sut.errorMessage).to.deep.equal 'Unable to retrieve device, missing uuid'

  describe '->getDevice', ->
    beforeEach ->
      params = $scope: @scope, $stateParams: @stateParams, $state: @state, $q: @q, deviceService: @deviceService
      @sut = @controller 'ClaimNodeController', params

    describe 'when called', ->
      beforeEach (done) ->
        @stateParams.uuid = 'holla'
        devices = [
          {uuid: 'holla', type: 'sweet'}
        ]
        @deviceService.getUnclaimedNodes.returns @q.when devices
        _.defer => @rootScope.$digest()
        @sut.getDevice().then (@device) => done()

      it 'should call getThing with the uuid', ->
        expect(@deviceService.getUnclaimedNodes).to.have.been.calledWith uuid: 'holla'

      it 'should resolve a device', ->
        expect(@device).to.deep.equal uuid: 'holla', type: 'sweet'

    describe 'when called with a different device', ->
      beforeEach (done) ->
        @stateParams.uuid = 'molla'
        devices = [
          {uuid: 'molla', type: 'mweet'}
        ]
        @deviceService.getUnclaimedNodes.returns @q.when devices
        _.defer => @rootScope.$digest()
        @sut.getDevice().then (@device) => done()

      it 'should call getThing with the uuid', ->
        expect(@deviceService.getUnclaimedNodes).to.have.been.calledWith uuid: 'molla'

      it 'should resolve a device', ->
        expect(@device).to.deep.equal uuid: 'molla', type: 'mweet'

    describe 'when called without a uuid or token', ->
      beforeEach (done) ->
        _.defer => @rootScope.$digest()
        @sut.getDevice().catch (@error) => done()

      it 'should call getThing with the uuid', ->
        expect(@deviceService.getUnclaimedNodes).to.not.have.been.called

      it 'should resolve a device', ->
        expect(@error).to.deep.equal 'Unable to retrieve device, missing uuid'

    describe 'when called with invalid uuid or token', ->
      beforeEach (done) ->
        @stateParams.uuid = 'tolla'
        @stateParams.token = 'lolla'
        @deviceService.getUnclaimedNodes.returns @q.reject 'Invalid device'
        _.defer => @rootScope.$digest()
        _.defer => @rootScope.$digest()
        @sut.getDevice().catch (@error) => done()

      it 'should call getThing with the uuid', ->
        expect(@deviceService.getUnclaimedNodes).to.have.been.calledWith uuid: 'tolla'

      it 'should resolve a device', ->
        expect(@error).to.deep.equal 'Invalid device'

  describe '->claimDevice', ->
    beforeEach ->
      params = $scope: @scope, $stateParams: @stateParams, $state: @state, $q: @q, deviceService: @deviceService
      @sut = @controller 'ClaimNodeController', params

    describe 'when called', ->
      beforeEach (done) ->
        @sut.device = {}
        @sut.deviceName = 'mokka'
        @stateParams.uuid = 'holla'
        @deviceService.claimDevice.returns @q.when null
        _.defer => @rootScope.$digest()
        @sut.claimDevice().then (@device) => done()

      it 'should call claimDevice with the uuid', ->
        expect(@deviceService.claimDevice).to.have.been.calledWith uuid: 'holla', name: 'mokka'

      it 'should resolve a device', ->
        expect(@device).to.deep.equal uuid: 'holla', name: 'mokka'

      it 'should call go state', ->
        expect(@state.go).to.have.been.called

    describe 'when called with a different device', ->
      beforeEach (done) ->
        @sut.device = {}
        @sut.deviceName = 'kokka'
        @stateParams.uuid = 'molla'
        @deviceService.claimDevice.returns @q.when null
        _.defer => @rootScope.$digest()
        @sut.claimDevice().then (@device) => done()

      it 'should call claimDevice with the uuid', ->
        expect(@deviceService.claimDevice).to.have.been.calledWith uuid: 'molla', name: 'kokka'

      it 'should resolve a device', ->
        expect(@device).to.deep.equal uuid: 'molla', name: 'kokka'

      it 'should call go state', ->
        expect(@state.go).to.have.been.called

    describe 'when called without a uuid or token', ->
      beforeEach (done) ->
        _.defer => @rootScope.$digest()
        @sut.claimDevice().catch (@error) => done()

      it 'should call claimDevice with the uuid', ->
        expect(@deviceService.claimDevice).to.not.have.been.called

      it 'should resolve a device', ->
        expect(@error).to.deep.equal 'Unable to claim device, missing uuid'

    describe 'when called with invalid uuid or token', ->
      beforeEach (done) ->
        @sut.device = {}
        @sut.deviceName = 'pokka'
        @stateParams.uuid = 'molla'
        @stateParams.token = 'lolla'
        @deviceService.claimDevice.returns @q.reject 'Invalid device'
        _.defer => @rootScope.$digest()
        _.defer => @rootScope.$digest()
        @sut.claimDevice().catch (@error) => done()

      it 'should call claimDevice with the uuid', ->
        expect(@deviceService.claimDevice).to.have.been.calledWith uuid: 'molla', name: 'pokka'

      it 'should resolve a device', ->
        expect(@error).to.deep.equal 'Invalid device'
