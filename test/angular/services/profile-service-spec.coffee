describe 'ProfileService', ->
  beforeEach ->
    @skynet = {}
    @skynetService = {}
    @cookies = {}

    module 'octobluApp', ($provide) =>
      $provide.value '$cookies', @cookies
      $provide.value 'skynetService', @skynetService
      return # !important

    inject ($q, $httpBackend, $rootScope) =>
      @q = $q
      @skynetService.getSkynetConnection = => @q.when(@skynet)
      @httpBackend = $httpBackend
      @rootScope = $rootScope

    inject (ProfileService) =>
      @sut = ProfileService

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->generateSessionToken', ->
    describe 'with these cookies', ->
      beforeEach ->
        @cookies.meshblu_auth_uuid  = '3musket'
        @cookies.meshblu_auth_token  = 'teers'
        @skynet.generateAndStoreToken = sinon.stub().yields()
        @sut.generateSessionToken()
        @rootScope.$digest()

      it 'should call generateAndStoreToken on the meshblu', ->
        expect(@skynet.generateAndStoreToken).to.have.been.calledWith uuid: '3musket', token: 'teers'

    describe 'with those cookies', ->
      beforeEach ->
        @cookies.meshblu_auth_uuid  = 'milky'
        @cookies.meshblu_auth_token  = 'way'
        @skynet.generateAndStoreToken = sinon.stub().yields()
        @sut.generateSessionToken()
        @rootScope.$digest()

      it 'should call generateAndStoreToken on the meshblu', ->
        expect(@skynet.generateAndStoreToken).to.have.been.calledWith uuid: 'milky', token: 'way'

    describe 'when there is an error', ->
      beforeEach ->
        @skynet.generateAndStoreToken = sinon.stub().yields()
        @sut.generateSessionToken().catch (@error) =>
        @rootScope.$digest()

      it 'should have an error', ->
        expect(@error).to.exist

    describe 'when there is not an error', ->
      beforeEach ->
        @skynet.generateAndStoreToken = sinon.stub().yields(uuid: 'this', token: 'that')
        @sut.generateSessionToken().catch (@error) =>
        @rootScope.$digest()

      it 'should not have an error', ->
        expect(@error).not.to.exist
