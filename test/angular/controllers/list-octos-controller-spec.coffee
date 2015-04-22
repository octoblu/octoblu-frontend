describe 'ListOctosController', ->
  beforeEach ->
    module 'octobluApp'

    inject ($controller, $q, $rootScope) =>
      @q = $q
      @rootScope = $rootScope
      @octos = []
      @OctoService =
        list: => $q.when @octos
        remove: sinon.spy()
        add: sinon.spy()

      @sut = $controller 'ListOctosController', $scope: @rootScope.$new(), OctoService: @OctoService

    @rootScope.$digest()

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->constructor', ->
    it 'should set the OctoService list result to itself', ->
      expect(@sut.octos).to.equal @octos

  describe '->addOcto', ->
    describe 'when called and we have one octo', ->
      beforeEach ->
        @sut.octos = [{}]
        @sut.addOcto()

      it 'should not add an octo to the octos', ->
        expect(@sut.octos).to.deep.equal [{}]

    describe 'when called and we have zero octos', ->
      beforeEach ->
        @sut.octos = []
        @sut.addOcto()

      it 'should add an octo to the octos', ->
        expect(@sut.octos).to.deep.equal [{}]

      it 'should call OctoService.add()', ->
        expect(@OctoService.add).to.have.been.called

  describe '->canAddOcto', ->
    describe 'when called and we have one octo', ->
      beforeEach ->
        @sut.octos = [{}]
        @result = @sut.canAddOcto()

      it 'should return false', ->
        expect(@result).to.be.false

    describe 'when called and we have multiple octos', ->
      beforeEach ->
        @sut.octos = [{}, {}]
        @result = @sut.canAddOcto()

      it 'should return false', ->
        expect(@result).to.be.false

    describe 'when called and we have zero octos', ->
      beforeEach ->
        @sut.octos = []
        @result = @sut.canAddOcto()

      it 'should return true', ->
        expect(@result).to.be.true

  describe '->canRemoveOcto', ->
    describe 'when called and we have one octo', ->
      beforeEach ->
        @sut.octos = [{}]
        @result = @sut.canRemoveOcto()

      it 'should return true', ->
        expect(@result).to.be.true

    describe 'when called and we have multiple octos', ->
      beforeEach ->
        @sut.octos = [{}, {}]
        @result = @sut.canRemoveOcto()

      it 'should return true', ->
        expect(@result).to.be.true

    describe 'when called and we have zero octos', ->
      beforeEach ->
        @sut.octos = []
        @result = @sut.canRemoveOcto()

      it 'should return false', ->
        expect(@result).to.be.false

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

  describe '->removeErrorMessage', ->
    describe 'when called', ->
      beforeEach ->
        @sut.removeErrorMessage()

      it 'should set errorMessage', ->
        expect(@sut.errorMessage).to.not.exist

  describe '->removeOcto', ->
    describe 'when called and we have multiple octos', ->
      beforeEach ->
        @sut.octos = [{}, {}]
        @sut.removeOcto()

      it 'should remove an octo from the octos', ->
        expect(@sut.octos).to.deep.equal [{}]

    describe 'when called and we have one octo', ->
      beforeEach ->
        @sut.octos = [uuid: 'bo-ya']
        @sut.removeOcto()

      it 'should remove the last octo', ->
        expect(@sut.octos).to.deep.equal []

      it 'should call OctoService.remove()', ->
        expect(@OctoService.remove).to.have.been.calledWith uuid: 'bo-ya'
