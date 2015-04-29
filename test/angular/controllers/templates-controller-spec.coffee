describe 'TemplateController', ->
  beforeEach ->
    module 'octobluApp'

    inject ($controller, $rootScope) =>
      @rootScope = $rootScope
      @scope = $rootScope.$new()
      @sut = $controller 'TemplateController'

    it 'should exist', ->
      expect(@sut).to.exist
