describe 'MeshbluDeviceService', ->
  beforeEach ->
    @skynet = {}
    @skynetService = {}

    module 'octobluApp', ($provide) =>
      $provide.value '$cookies', {}
      $provide.value 'skynetService', @skynetService
      return # !important

    inject ($q, $httpBackend, $rootScope) =>
      @q = $q
      @skynetService.getSkynetConnection = => @q.when(@skynet)
      @httpBackend = $httpBackend
      @rootScope = $rootScope

    inject (MeshbluDeviceService) =>
      @sut =MeshbluDeviceService

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->get', ->
    describe 'this device exists', ->
      beforeEach ->
        @skynet.devices = sinon.stub().yields devices: [{}]
        @sut.get('Tinky Winky').then (@result) =>
        @rootScope.$digest()

      it 'should call devices on the meshblu', ->
        expect(@skynet.devices).to.have.been.calledWith uuid: 'Tinky Winky'

      it 'should resolve with a device', ->
        expect(@result).to.deep.equal {}

    describe 'this device doesnt exists', ->
      beforeEach ->
        @skynet.devices = sinon.stub().yields devices: []
        @sut.get('Noo-noo').catch (@error) =>
        @rootScope.$digest()

      it 'should reject', ->
        expect(@error).to.exist
