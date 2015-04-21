xdescribe 'OctoService', ->
  beforeEach ->
    module 'octobluApp'

    inject ($rootScope, OctoService) =>
      @rootScope = $rootScope
      @sut = OctoService

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->list', ->
    beforeEach ->
      _.defer => @rootScope.$digest()
      @sut.list().then (@octos) =>

    it 'should resolve a list of octo-owls', ->
      expect(@octos).to.deep.equal [{}, {}]
