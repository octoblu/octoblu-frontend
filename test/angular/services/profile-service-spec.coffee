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
