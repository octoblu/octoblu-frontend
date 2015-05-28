describe 'BluprintService', ->
  beforeEach ->
    @OCTOBLU_API_URL = 'bananas.com'
    module 'octobluApp', ($provide) =>
      $provide.constant 'OCTOBLU_API_URL', @OCTOBLU_API_URL
      return

    inject ($q, $rootScope, BluprintService, $httpBackend) =>
      @q = $q
      @rootScope = $rootScope
      @httpBackend = $httpBackend
      @sut = BluprintService

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->getPublicBluprints', ->
    it 'should exist', ->
      expect(@sut.getPublicBluprints).to.be.a 'function'

    describe 'when called', ->
      it 'should make a request to the octoblu api for public flows', ->
        @httpBackend.expectGET("#{@OCTOBLU_API_URL}/api/templates/public").respond 201
        @sut.getPublicBluprints()
        @httpBackend.flush()

    describe 'when called with tags', ->
      it 'should make a request to the octoblu api for public flows with the tags as a url parameter', ->
        @httpBackend.expectGET("#{@OCTOBLU_API_URL}/api/templates/public?tags=apples&tags=bananas").respond 201
        @sut.getPublicBluprints ['apples', 'bananas']
        @httpBackend.flush()
