describe 'TemplateService', ->
  beforeEach ->
    @OCTOBLU_API_URL = 'bananas.com'
    module 'octobluApp', ($provide) =>
      $provide.constant 'OCTOBLU_API_URL', @OCTOBLU_API_URL
      return

    inject ($q, $rootScope, TemplateService, $httpBackend) =>
      @q = $q
      @rootScope = $rootScope
      @httpBackend = $httpBackend
      @sut = TemplateService

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->getPublicTemplates', ->
    it 'should exist', ->
      expect(@sut.getPublicTemplates).to.be.a 'function'

    describe 'when called', ->
      it 'should make a request to the octoblu api for public flows', ->
        @httpBackend.expectGET("#{@OCTOBLU_API_URL}/api/templates/public").respond 201
        @sut.getPublicTemplates()
        @httpBackend.flush()

    describe 'when called with tags', ->
      it 'should make a request to the octoblu api for public flows with the tags as a url parameter', ->
        @httpBackend.expectGET("#{@OCTOBLU_API_URL}/api/templates/public?tags=apples&tags=bananas").respond 201
        @sut.getPublicTemplates ['apples', 'bananas']
        @httpBackend.flush()
