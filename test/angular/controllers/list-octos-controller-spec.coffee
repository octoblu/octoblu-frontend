describe 'ListOctosController', ->
  beforeEach ->
    module 'octobluApp'

    inject ($controller, $q, $rootScope) =>
      @q = $q
      @rootScope = $rootScope
      @octos = []
      @OctoService = list: => $q.when @octos

      @sut = $controller 'ListOctosController', $scope: @rootScope.$new(), OctoService: @OctoService

    @rootScope.$digest()

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->constructor', ->
    it 'should set the OctoService list result to itself', ->
      expect(@sut.octos).to.equal @octos

  describe '->refresh', ->
    describe 'when OctoService resolves an owl', ->
      beforeEach ->
        @OctoService.list = => @q.when [{}, {}]
        @sut.refresh()
        @rootScope.$digest()

      it 'should set the owl to itself', ->
        expect(@sut.octos).to.deep.equal [{}, {}]

    describe 'when OctoService rejects with an error', ->
      beforeEach ->
        @OctoService.list = => @q.reject new Error('oh no')
        @sut.refresh()
        @rootScope.$digest()

      it 'should set the error message to itself', ->
        expect(@sut.errorMessage).to.deep.equal 'oh no'
