describe 'ProfileService', ->
  beforeEach ->
    @cookies = {}

    module 'octobluApp', ($provide) =>
      $provide.value '$cookies', @cookies
      return # !important

    inject ($q, $httpBackend, $rootScope, MeshbluHttpService) =>
      @q = $q
      @httpBackend = $httpBackend
      @rootScope = $rootScope
      @MeshbluHttpService = MeshbluHttpService

    inject (ProfileService) =>
      @sut = ProfileService

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->generateSessionToken', ->
    describe 'with these cookies', ->
      beforeEach ->
        @cookies.meshblu_auth_uuid  = '3musket'
        @cookies.meshblu_auth_token  = 'teers'
        @MeshbluHttpService.generateAndStoreToken = sinon.stub().yields()
        @sut.generateSessionToken()
        @rootScope.$digest()

      it 'should call generateAndStoreToken on the meshblu', ->
        expect(@MeshbluHttpService.generateAndStoreToken).to.have.been.calledWith '3musket'

    describe 'with those cookies', ->
      beforeEach ->
        @cookies.meshblu_auth_uuid  = 'milky'
        @cookies.meshblu_auth_token  = 'way'
        @MeshbluHttpService.generateAndStoreToken = sinon.stub().yields()
        @sut.generateSessionToken()
        @rootScope.$digest()

      it 'should call generateAndStoreToken on the meshblu', ->
        expect(@MeshbluHttpService.generateAndStoreToken).to.have.been.calledWith 'milky'

    describe 'when there is an error', ->
      beforeEach ->
        @MeshbluHttpService.generateAndStoreToken = sinon.stub().yields new Error()
        @sut.generateSessionToken().catch (@error) =>
        @rootScope.$digest()

      it 'should have an error', ->
        expect(@error).to.exist

    describe 'when there is not an error', ->
      beforeEach ->
        @MeshbluHttpService.generateAndStoreToken = sinon.stub().yields null
        @sut.generateSessionToken().catch (@error) =>
        @rootScope.$digest()

      it 'should not have an error', ->
        expect(@error).not.to.exist
