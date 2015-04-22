describe 'OctoService', ->
  beforeEach ->
    @deviceService = {}

    module 'octobluApp', ($provide) =>
      $provide.value 'deviceService', @deviceService
      $provide.value 'OCTOBLU_API_URL', 'http://awesome.com'
      return

    inject ($q, $rootScope, OctoService, _$httpBackend_) =>
      @q = $q
      @rootScope = $rootScope
      @httpBackend = _$httpBackend_
      @sut = OctoService

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->list', ->
    describe 'when called and the device service resolves only two octos', ->
      beforeEach ->
        devices = [{type: 'octoblu:octo'}, {type: 'octoblu:octo'}]
        @deviceService.getDevices = sinon.stub().returns @q.when(devices)
        _.defer => @rootScope.$digest()
        @sut.list().then (@octos) =>

      it 'should resolve a list of octo-owls', ->
        expect(@octos).to.deep.equal [{type: 'octoblu:octo'}, {type: 'octoblu:octo'}]

    describe 'when called and the device service resolves one octo and one other device', ->
      beforeEach ->
        devices = [{type: 'someother:device'}, {type: 'octoblu:octo'}]
        @deviceService.getDevices = sinon.stub().returns @q.when(devices)
        _.defer => @rootScope.$digest()
        @sut.list().then (@octos) =>

      it 'should resolve a list of octo-owls without the other device', ->
        expect(@octos).to.deep.equal [{type: 'octoblu:octo'}]

    describe 'when called and the device service rejects', ->
      beforeEach ->
        @deviceService.getDevices = sinon.stub().returns @q.reject()
        _.defer => @rootScope.$digest()
        @sut.list().catch (@error) =>

      it 'should resolve a list of octo-owls without the other device', ->
        expect(@error).to.exist

  describe '->add', ->
    describe 'when called', ->
      it 'should send a request to start the octo', ->
        @httpBackend.expectPOST('/api/octos').respond(201)
        @sut.add()
        @httpBackend.flush()

  describe '->remove', ->
    describe 'when called with a octo', ->
      it 'should send a request to start the octo', ->
        @httpBackend.expectDELETE('/api/octos/great-uuid').respond(200)
        @sut.remove(uuid: 'great-uuid')
        @httpBackend.flush()
