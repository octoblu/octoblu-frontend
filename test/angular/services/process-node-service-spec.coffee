describe 'ProcessNodeService', ->

  beforeEach =>
    module 'octobluApp', ($provide) =>
       @fakeDeviceService = new FakeDeviceService($q)
       $provide.value 'deviceService', @fakeDeviceService
       return

    inject (ProcessNodeService, $q, $rootScope, $httpBackend) =>
      @q = $q
      @rootScope = $rootScope
      @sut = ProcessNodeService
      $httpBackend.whenGET("/api/auth").respond 200
      $httpBackend.whenGET("/pages/material.html").respond 200
      $httpBackend.whenGET("/pages/home.html").respond 200
      
  it "should exist", =>
    expect(@sut).to.exist

  describe "getProcessDevices", =>  
    it "should exist", =>
      expect(@sut.getProcessDevices).to.exist

    describe "when it is called", =>
      it "should call the DeviceService.getDevices", => 
        @sut.getProcessDevices()
        expect(@fakeDeviceService.getDevices).to.have.been.called
      it "it should return an empty list, when the user doesn't own any devices", (done)=>
        @fakeDeviceService.getDevices.returns @q.when []
        @sut.getProcessDevices().then((devices) ->
          expect(devices).to.deep.equal []                    
          done()
        )
        @rootScope.$digest()
        return

  describe "stopProcess", =>  
    it "should exist", =>
      expect(@sut.stopProcess).to.exist

  describe "startProcess", =>  
    it "should exist", =>
      expect(@sut.startProcess).to.exist

class FakeDeviceService
    constructor: (@q) ->
      @getDevices = sinon.stub().returns @q.when()
