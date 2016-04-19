describe 'MeshbluDeviceService', ->
  beforeEach ->
    module 'octobluApp', ($provide) =>
      $provide.value '$cookies', {}
      return # !important

    inject ($q, $httpBackend, $rootScope, MeshbluHttpService) =>
      @q = $q
      @httpBackend = $httpBackend
      @rootScope = $rootScope
      @MeshbluHttpService = MeshbluHttpService

    inject (MeshbluDeviceService) =>
      @sut =MeshbluDeviceService

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->get', ->
    describe 'this device exists', ->
      beforeEach ->
        @MeshbluHttpService.device = sinon.stub().yields null, {}
        @sut.get('Tinky Winky').then (@result) =>
        @rootScope.$digest()

      it 'should call devices on the meshblu', ->
        expect(@MeshbluHttpService.device).to.have.been.calledWith 'Tinky Winky'

      it 'should resolve with a device', ->
        expect(@result).to.deep.equal {}

    describe 'this device doesnt exists', ->
      beforeEach ->
        @MeshbluHttpService.device = sinon.stub().yields new Error()
        @sut.get('Noo-noo').catch (@error) =>
        @rootScope.$digest()

      it 'should reject', ->
        expect(@error).to.exist
