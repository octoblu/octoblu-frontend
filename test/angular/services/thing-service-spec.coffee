describe 'ThingService', ->
  beforeEach ->
    module 'octobluApp', ($provide) =>

    inject ($q, $rootScope) =>
      @q = $q
      @rootScope = $rootScope

    inject (ThingService) =>
      @sut = ThingService

  describe '->getThings', ->
    it 'should be a function', ->
      @sut.getThings()
  
