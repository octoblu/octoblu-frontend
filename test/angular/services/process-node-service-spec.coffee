describe 'ProcessNodeService', ->

  beforeEach =>
    class FakeDeviceService
      constructor: (@q) ->
        @getDevices = sinon.stub().returns @q.when()

    class FakeSkynetService
      constructor: (@q) ->
        @getSkynetConnection = sinon.stub().returns @q.when()

    class FakeSkynetConnection
      message: sinon.stub()
      subscribe : sinon.stub()

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
      
      @fakeSkynetService.getSkynetConnection.returns @q.when @fakeSkynetConnection

  it "should exist", =>
    expect(@sut).to.exist

  describe "getProcessDevices", => 
    describe "when there are no devices", => 
      beforeEach (done) =>
        @fakeDeviceService.getDevices.returns @q.when []
        @devicePromise = @sut.getProcessDevices().then (@devices)=> done()
        @rootScope.$digest()

      it 'should get a connection to meshblu', =>
        expect(@fakeSkynetService.getSkynetConnection).to.have.been.called

      it "should call the DeviceService.getDevices", => 
        expect(@fakeDeviceService.getDevices).to.have.been.called

      it "it should return an empty list, when the user doesn't own any devices", =>
        expect(@devices).to.deep.equal []                    

    describe "when there are two devices", => 
      beforeEach (done) => 
        @firstDevice = {uuid : '9c754622-4c14-4266-a3b4-f89016a0e707'}
        @secondDevice = {uuid : 'e08f163c-60c1-4d5c-804b-4021c8ea58da'}
        @fakeDeviceService.getDevices.returns @q.when [@firstDevice, @secondDevice]
        @devicePromise = @sut.getProcessDevices().then (@devices)=> done()
        @rootScope.$digest()

      it "should call subscribe for each device in the list of devices", => 
        expect(@fakeSkynetConnection.subscribe).to.have.been.calledWith @firstDevice
        expect(@fakeSkynetConnection.subscribe).to.have.been.calledWith @secondDevice


  describe "stopProcess", =>

    describe 'calling on a device', =>
      beforeEach =>
        @uuid = '2d05cbf2-69b2-4c70-89a8-3f515d33693f'
        @options = {topic : 'device-stop'}
        @sut.stopProcess(@uuid)
        @rootScope.$digest()

      it 'should get a connection to meshblu', =>
        expect(@fakeSkynetService.getSkynetConnection).to.have.been.called

      it 'should get call message on the meshblu connection', =>
        expect(@fakeSkynetConnection.message).to.have.been.calledWith(@uuid, null, @options)

    describe 'calling on another device', =>
      beforeEach =>
        @uuid = 'd995ec6e-4a39-42b9-af0a-178ef76a2433'
        @options = {topic : 'device-stop'}
        @sut.stopProcess(@uuid)
        @rootScope.$digest()

      it 'should get a connection to meshblu', =>
        expect(@fakeSkynetService.getSkynetConnection).to.have.been.called

      it 'should get call message on the meshblu connection', =>
        expect(@fakeSkynetConnection.message).to.have.been.calledWith(@uuid, null, @options)


  describe "startProcess", =>
    describe 'calling on a device', =>
      beforeEach =>
        @uuid = '2d05cbf2-69b2-4c70-89a8-3f515d33693f'
        @options = {topic : 'device-start'}
        @sut.startProcess(@uuid)
        @rootScope.$digest()

      it 'should get a connection to meshblu', =>
        expect(@fakeSkynetService.getSkynetConnection).to.have.been.called

      it 'should get call message on the meshblu connection', =>
        expect(@fakeSkynetConnection.message).to.have.been.calledWith(@uuid, null, @options)

    describe 'calling on another device', =>
      beforeEach =>
        @uuid = 'd995ec6e-4a39-42b9-af0a-178ef76a2433'
        @options = {topic : 'device-start'}
        @sut.startProcess(@uuid)
        @rootScope.$digest()

      it 'should get a connection to meshblu', =>
        expect(@fakeSkynetService.getSkynetConnection).to.have.been.called

      it 'should get call message on the meshblu connection', =>
        expect(@fakeSkynetConnection.message).to.have.been.calledWith(@uuid, null, @options)

