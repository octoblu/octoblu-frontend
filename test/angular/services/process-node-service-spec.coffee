describe 'ProcessNodeService', ->

  beforeEach =>
    class FakeDeviceService
      constructor: (@q) ->
        @getDevices = sinon.stub().returns @q.when()

    class FakeSkynetService
      constructor: (@q) ->
        @getSkynetConnection = sinon.stub().returns @q.when()

    class FakeSkynetConnection extends EventEmitter
      message: sinon.stub()
      subscribe: sinon.stub()

    module 'octobluApp', ($provide) =>
      @fakeDeviceService = new FakeDeviceService($q)
      @fakeSkynetService = new FakeSkynetService($q)
      @fakeSkynetConnection = new FakeSkynetConnection 
      $provide.value 'deviceService', @fakeDeviceService
      $provide.value 'skynetService', @fakeSkynetService
      return

    inject (ProcessNodeService, $q, $rootScope, $httpBackend) =>
      @q = $q
      @rootScope = $rootScope
      @sut = ProcessNodeService
      $httpBackend.whenGET("/api/auth").respond 200
      $httpBackend.whenGET("/pages/material.html").respond 200
      $httpBackend.whenGET("/pages/home.html").respond 200
      @sut.getSkynetConnection = sinon.stub().returns @q.when @fakeSkynetConnection

  describe "getProcessNodes", =>
    describe "when there are no devices", => 
      beforeEach (done) =>
        @fakeDeviceService.getDevices.returns @q.when []
        @devicePromise = @sut.getProcessNodes().then (@devices)=> done()
        @rootScope.$digest()

      it 'should get a connection to meshblu', =>
        expect(@sut.getSkynetConnection).to.have.been.called

      it "should call the DeviceService.getDevices", => 
        expect(@fakeDeviceService.getDevices).to.have.been.called

      it "it should return an empty list, when the user doesn't own any devices", =>
        expect(@devices).to.deep.equal []                    

    describe "when sending to a device that does not exist", => 
      beforeEach (done) => 
        @firstDevice = {uuid : '9c754622-4c14-4266-a3b4-f89016a0e707', messagesSent: 0}
        @sut.listenToMessages().then =>
          @sut.devices = [@firstDevice]
          @fakeSkynetConnection.emit 'message', {fromUuid : 'eb5f9298-d9dc-4ebe-84dd-9ba90684a39a'}
          done()
        @rootScope.$apply()

      it "should not update the messagesSent count", => 
        expect(@firstDevice.messagesSent).to.equal 0

    describe "when sending a single message", => 
      beforeEach (done) => 
        @firstDevice = {uuid : '9c754622-4c14-4266-a3b4-f89016a0e707', messagesSent: 0}
        @sut.listenToMessages().then =>
          @sut.devices = [@firstDevice]
          @fakeSkynetConnection.emit 'message', {fromUuid : '9c754622-4c14-4266-a3b4-f89016a0e707'}
          done()
        @rootScope.$apply()

      it "should update the messagesSent count", => 
        expect(@firstDevice.messagesSent).to.equal 1

    describe "when a device is receiving a single message", => 
      beforeEach (done) => 
        @firstDevice = {uuid : '9c754622-4c14-4266-a3b4-f89016a0e707'}
        @sut.listenToMessages().then =>
          @sut.devices = [@firstDevice]
          @fakeSkynetConnection.emit 'message', {devices : '9c754622-4c14-4266-a3b4-f89016a0e707'}
          done()
        @rootScope.$apply()

      it "should update the messagesReceived count", => 
        expect(@firstDevice.messagesReceived).to.equal 1

    describe "when the message addresses a non-existent device", => 
      beforeEach (done) => 
        @firstDevice = {uuid : '7cda5e1d-eccd-468f-be6f-8061b5ad79b7', messagesReceived: 0}
        @sut.listenToMessages().then =>
          @sut.devices = [@firstDevice]
          @fakeSkynetConnection.emit 'message', {devices : ['9c754622-4c14-4266-a3b4-f89016a0e707']}
          done()
        @rootScope.$apply()

      it "should update the messagesReceived count", => 
        expect(@firstDevice.messagesReceived).to.equal 0

    describe "when the message has multiple devices", => 
      beforeEach (done) => 
        @firstDevice = {uuid : '9c754622-4c14-4266-a3b4-f89016a0e707'}
        @sut.listenToMessages().then =>
          @sut.devices = [@firstDevice]
          @fakeSkynetConnection.emit 'message', {devices : ['9c754622-4c14-4266-a3b4-f89016a0e707', 'dcff98bb-59e6-44d5-9025-a6053044942e']}
          done()
        @rootScope.$apply()

      it "should update the messagesReceived count", => 
        expect(@firstDevice.messagesReceived).to.equal 1

    describe "when multiple devices receive a message that is addressed to multiple devices", => 
      beforeEach (done) => 
        @firstDevice = {uuid : '9c754622-4c14-4266-a3b4-f89016a0e707'}
        @secondDevice = {uuid : 'dcff98bb-59e6-44d5-9025-a6053044942e'}
        @sut.listenToMessages().then =>
          @sut.devices = [@firstDevice, @secondDevice]
          @fakeSkynetConnection.emit 'message', {devices : ['9c754622-4c14-4266-a3b4-f89016a0e707', 'dcff98bb-59e6-44d5-9025-a6053044942e']}
          @fakeSkynetConnection.emit 'message', {devices : ['9c754622-4c14-4266-a3b4-f89016a0e707', 'dcff98bb-59e6-44d5-9025-a6053044942e']}
          done()
        @rootScope.$apply()

      it "should update the messagesReceived count", => 
        expect(@firstDevice.messagesReceived).to.equal 2

      it "should update the messagesReceived count", => 
        expect(@secondDevice.messagesReceived).to.equal 2

    describe "when a device is receiving multiple messages", => 
      beforeEach (done) => 
        @firstDevice = {uuid : '9c754622-4c14-4266-a3b4-f89016a0e707'}
        @sut.listenToMessages().then =>
          @sut.devices = [@firstDevice]
          @fakeSkynetConnection.emit 'message', {devices : '9c754622-4c14-4266-a3b4-f89016a0e707'}
          @fakeSkynetConnection.emit 'message', {devices : '9c754622-4c14-4266-a3b4-f89016a0e707'}
          done()
        @rootScope.$apply()

      it "should update the messagesReceived count", => 
        expect(@firstDevice.messagesReceived).to.equal 2

    describe "when there are two devices and only device is receiving a message", => 
      beforeEach (done) => 
        @firstDevice = {uuid : '9c754622-4c14-4266-a3b4-f89016a0e707', messagesReceived: 0}
        @secondDevice = {uuid : 'df88b19b-1f59-484a-8a4d-525213492f02', messagesReceived: 0}
        @sut.listenToMessages().then =>
          @sut.devices = [@firstDevice, @secondDevice]
          @fakeSkynetConnection.emit 'message', {devices: 'df88b19b-1f59-484a-8a4d-525213492f02'}
          done()
        @rootScope.$apply()

      it "should not update the messagesReceived count of the first device", => 
        expect(@firstDevice.messagesReceived).to.equal 0

      it "should update the messagesReceived count of the second device", => 
        expect(@secondDevice.messagesReceived).to.equal 1

  describe "stopProcess", =>
    describe 'calling on a device', =>
      beforeEach =>
        @uuid = '2d05cbf2-69b2-4c70-89a8-3f515d33693f'
        @options = {topic : 'device-stop'}
        @sut.stopProcess(@uuid)
        @rootScope.$digest()

      it 'should get a connection to meshblu', =>
        expect(@sut.getSkynetConnection).to.have.been.called

      it 'should get call message on the meshblu connection', =>
        expect(@fakeSkynetConnection.message).to.have.been.calledWith(@uuid, null, @options)

    describe 'calling on another device', =>
      beforeEach =>
        @uuid = 'd995ec6e-4a39-42b9-af0a-178ef76a2433'
        @options = {topic : 'device-stop'}
        @sut.stopProcess(@uuid)
        @rootScope.$digest()

      it 'should get a connection to meshblu', =>
        expect(@sut.getSkynetConnection).to.have.been.called

      it 'should get call message on the meshblu connection', =>
        expect(@fakeSkynetConnection.message).to.have.been.calledWith(@uuid, null, @options)


  # describe "startProcess", =>
  #   describe 'calling on a device', =>
  #     beforeEach =>
  #       @uuid = '2d05cbf2-69b2-4c70-89a8-3f515d33693f'
  #       @options = {topic : 'device-start'}
  #       @sut.startProcess(@uuid)
  #       @rootScope.$digest()

  #     it 'should get a connection to meshblu', =>
  #       expect(@fakeSkynetService.getSkynetConnection).to.have.been.called

  #     it 'should get call message on the meshblu connection', =>
  #       expect(@fakeSkynetConnection.message).to.have.been.calledWith(@uuid, null, @options)

  #   describe 'calling on another device', =>
  #     beforeEach =>
  #       @uuid = 'd995ec6e-4a39-42b9-af0a-178ef76a2433'
  #       @options = {topic : 'device-start'}
  #       @sut.startProcess(@uuid)
  #       @rootScope.$digest()

  #     it 'should get a connection to meshblu', =>
  #       expect(@fakeSkynetService.getSkynetConnection).to.have.been.called

  #     it 'should get call message on the meshblu connection', =>
  #       expect(@fakeSkynetConnection.message).to.have.been.calledWith(@uuid, null, @options)

