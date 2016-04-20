describe 'GatebluLogService', ->
  beforeEach ->
    @APPLICATION = 'app-octoblu'
    @WORKFLOW = 'device-add-to-gateblu'
    @GATEBLU_LOGGER_UUID = 'd02f42fd-2f61-402e-8491-8efa2c8ad32d'

    module 'octobluApp', ($provide) =>
      @fakeUUIDService = new FakeUUIDService()
      $provide.value '$cookies', { meshblu_auth_uuid : 'second-assassin'}
      $provide.value 'UUIDService', @fakeUUIDService
      $provide.value 'GATEBLU_LOGGER_UUID', @GATEBLU_LOGGER_UUID
      return # !important

    inject (GatebluLogService, MeshbluHttpService) =>
      @sut = new GatebluLogService()
      @MeshbluHttpService = MeshbluHttpService


  FakeUUIDService = () =>
    _this = this

    _this.v1 = sinon.spy(() =>
      _this.v1.returns
    )

    this

  it 'should exist', ->
    expect(@sut).to.exist


  describe '->addDeviceBegin', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @device =
        connector: 'bad-droppings'
      @gatebluUuid = 'pope-of-nope'
      @sut.addDeviceBegin @gatebluUuid, @device.connector

    it 'should called logEvent with the state and device type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'begin', null, @gatebluUuid, @device.connector

  describe '->registerDeviceBegin', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @device =
        connector: 'robotify'
      @gatebluUuid = 'narnope'
      @sut.registerDeviceBegin @gatebluUuid, @device.connector

    it 'should called logEvent with the state and device type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'register-device-begin', null, @gatebluUuid, @device.connector

  describe '->registerDeviceEnd', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @device =
        uuid : 'self-immolation'
        connector : 'non-lethal-shot'
      @gatebluUuid = 'nope-ninja'
      @sut.registerDeviceEnd @device.uuid, @gatebluUuid, @device.connector

    it 'should called logEvent with the state and device type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'register-device-end', @device.uuid, @gatebluUuid, @device.connector

  describe '->updateGatebluBegin', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @gateblu =
        uuid : 'escaped-prisoner'
      @device =
        uuid : 'glass-of-nope'
        connector : 'animal-expert'
      @sut.updateGatebluBegin @device.uuid, @gateblu.uuid, @device.connector

    it 'should called logEvent with the state and device type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'gateblu-update-begin', @device.uuid, @gateblu.uuid, @device.connector

  describe '->updateGatebluEnd', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @device =
        uuid: 'right-key'
        connector: 'walk-on-water'
      @gatebluUuid = 'a-butt-tuba'
      @sut.updateGatebluEnd @device.uuid, @gatebluUuid, @device.connector

    it 'should called logEvent with the state and device uuid and type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'gateblu-update-end', @device.uuid, @gatebluUuid, @device.connector

  describe '->deviceOptionsLoadBegin', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @device =
        uuid: 'heroic-feats'
        connector: 'smush-into-a-ball'
      @gatebluUuid = 'taco-cat'
      @sut.deviceOptionsLoadBegin @device.uuid, @gatebluUuid, @device.connector

    it 'should called logEvent with the state and device uuid and type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'device-options-load-begin', @device.uuid, @gatebluUuid, @device.connector

  describe '->deviceOptionsLoadEnd', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @device =
        uuid: 'ophelia'
        connector: 'plus-one-to-science'
      @gatebluUuid = 'potato-cat'
      @sut.deviceOptionsLoadEnd @device.uuid, @gatebluUuid, @device.connector

    it 'should call logEvent with the state and device uuid and type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'device-options-load-end', @device.uuid, @gatebluUuid, @device.connector

  describe '->addDeviceEnd', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @device =
        uuid: 'party'
        connector: 'solution'
      @gatebluUuid = 'monster-energy'
      @sut.addDeviceEnd @device.uuid, @gatebluUuid, @device.connector

    it 'should call logEvent with the state and device uuid and type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'end', @device.uuid, @gatebluUuid, @device.connector

  describe '->logEvents', ->
    beforeEach ->
      @MeshbluHttpService.message = sinon.stub()
      @userUuid = 'second-assassin'
      @state = 'ghost-appearance'
      @deviceUuid = 'assisted-flight'
      @gatebluUuid = 'rick-and-morty'
      @connector = 'premium-coffee'
      @DEPLOYMENT_UUID = @fakeUUIDService.v1()
      @sut.logEvent @state, @deviceUuid, @gatebluUuid, @connector

      @payload =
        deploymentUuid: @DEPLOYMENT_UUID
        application: @APPLICATION
        workflow: @WORKFLOW
        state: @state
        userUuid: @userUuid
        deviceUuid: @deviceUuid
        gatebluUuid: @gatebluUuid
        connector: @connector

      @message =
        devices: @GATEBLU_LOGGER_UUID
        payload: @payload

    it 'should called logEvent with the state and device type', ->
      firstArg = @MeshbluHttpService.message.firstCall.args[0]
      delete firstArg.payload.date
      expect(firstArg).to.deep.equal @message
