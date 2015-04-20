describe 'ListOctosController', ->
  beforeEach ->
    module 'octobluApp'

    inject ($controller, $rootScope) =>
      @rootScope = $rootScope
      @sut = $controller 'ListOctosController'

  it 'should exist', ->
    expect(@sut).to.exist
