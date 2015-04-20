describe 'ListOctosController', ->
  beforeEach ->
    module 'octobluApp'

    inject ($controller, $rootScope) =>
      @rootScope = $rootScope
      @sut = $controller 'ListOctosController', $scope: @rootScope.$new()

  it 'should exist', ->
    expect(@sut).to.exist
