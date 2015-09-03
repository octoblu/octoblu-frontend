describe 'GatebluLogService', ->
  beforeEach ->
    @skynet = {}
    @skynetService =
      sendMessage: sinon.stub()
    @APPLICATION = 'app-octoblu'
    @WORKFLOW = 'device-add-to-gateblu'
    @GATEBLU_LOGGER_UUID = 'd02f42fd-2f61-402e-8491-8efa2c8ad32d'

    module 'octobluApp', ($provide) =>
      @fakeUUIDService = new FakeUUIDService()
      $provide.value '$cookies', { meshblu_auth_uuid : 'second-assassin'}
      $provide.value 'skynetService', @skynetService
      $provide.value 'UUIDService', @fakeUUIDService
      $provide.value 'GATEBLU_LOGGER_UUID', @GATEBLU_LOGGER_UUID
      return # !important

    inject (GatebluLogService) =>
      @sut = new GatebluLogService()


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
        type: 'bad-droppings'
      @sut.addDeviceBegin @device

    it 'should called logEvent with the state and device type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'begin', type: @device.type

  describe '->registerDeviceBegin', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @device =
        type: 'robotify'
      @sut.registerDeviceBegin @device

    it 'should called logEvent with the state and device type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'register-device-begin', type: @device.type

  describe '->registerDeviceEnd', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @device =
        uuid : 'self-immolation'
        type : 'non-lethal-shot'
      @sut.registerDeviceEnd @device

    it 'should called logEvent with the state and device type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'register-device-end', { uuid: @device.uuid, type: @device.type }

  describe '->updateGatebluBegin', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @gateblu =
        uuid : 'escaped-prisoner'
        type : 'animal-expert'
        devices: ['bad-doctor', 'name-withheld', 'no-questions']
      @sut.updateGatebluBegin @gateblu

    it 'should called logEvent with the state and device type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'gateblu-update-begin', { uuid: @gateblu.uuid, type: @gateblu.type, devices: @gateblu.devices }

  describe '->updateGatebluEnd', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @device =
        uuid: 'right-key'
        type: 'walk-on-water'
      @sut.updateGatebluEnd @device

    it 'should called logEvent with the state and device uuid and type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'gateblu-update-end', { uuid: @device.uuid, type: @device.type }

  describe '->deviceOptionsLoadBegin', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @device =
        uuid: 'heroic-feats'
        type: 'smush-into-a-ball'
      @sut.deviceOptionsLoadBegin @device

    it 'should called logEvent with the state and device uuid and type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'device-options-load-begin', { uuid: @device.uuid, type: @device.type }

  describe '->deviceOptionsLoadEnd', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @device =
        uuid: 'ophelia'
        type: 'plus-one-to-science'
      @sut.deviceOptionsLoadEnd @device

    it 'should call logEvent with the state and device uuid and type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'device-options-load-end', { uuid: @device.uuid, type: @device.type }

  describe '->addDeviceEnd', ->
    beforeEach ->
      @sut.logEvent = sinon.stub()
      @device =
        uuid: 'party'
        type: 'solution'
      @sut.addDeviceEnd @device

    it 'should call logEvent with the state and device uuid and type', ->
      expect(@sut.logEvent).to.have.been.calledWith 'end', { uuid: @device.uuid, type: @device.type }

  describe '->logEvents', ->
    beforeEach ->
      @userUuid = 'second-assassin'
      @state = 'ghost-appearance'
      @device = 'assisted-flight'
      @DEPLOYMENT_UUID = @fakeUUIDService.v1()
      @sut.logEvent @state, @device

      @payload =
        deploymentUuid: @DEPLOYMENT_UUID
        application: @APPLICATION
        workflow: @WORKFLOW
        state: @state
        userUuid: @userUuid
        device: @device

      @message =
        devices: @GATEBLU_LOGGER_UUID
        payload: @payload

    it 'should called logEvent with the state and device type', ->
      expect(@skynetService.sendMessage).to.have.been.calledWith @message
