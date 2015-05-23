describe 'NodeCollectionController', ->
  beforeEach ->
    module 'octobluApp'

    inject ($controller, $q, $rootScope) =>
      @q = $q
      @rootScope = $rootScope
      @flowNodeTypes= []
      @FlowNodeTypeService =
        getFlowNodeTypes: => @q.when @flowNodeTypes

      @configuredNodes = []
      @NodeService =
        getNodes: => @q.when configuredNodes

      @sut = $controller 'NodeCollectionController',
        $scope: @rootScope.$new(),
        FlowNodeTypeService: @FlowNodeTypeService,
        NodeService: @NodeService

    @rootScope.$digest()

  it 'should exist', ->
    expect(@sut).to.exist

  describe '->getFlowNodeTypes', ->

    describe 'when flowNodeTypes are returned by the FlowNodeTypes service', ->

      beforeEach ->
        @FlowNodeTypeService.getFlowNodeTypes = sinon.stub().returns @q.when([])
        _.defer => @rootScope.$digest()
        @sut.getFlowNodeTypes()

      it 'should set the scope.flowNodeTypes to the resolved values', ->
        expect(@sut.scope.flowNodeTypes).to.deep.equal([])

    describe 'when flowNodeTypes are rejected by the FlowNodeTypes service', ->

      beforeEach ->
        @FlowNodeTypeService.getFlowNodeTypes = sinon.stub().returns @q.reject new Error('lame')
        _.defer => @rootScope.$digest()
        @sut.getFlowNodeTypes()

      it 'should reject...', ->
        expect(@sut.scope.errorMessage).to.deep.equal 'lame'
###
  describe '->getConfiguredNode', ->

    describe 'when getConfiguredNode is returned by the NodeService', ->

      beforeEach ->
        @NodeService.getNodes = sinon.stub().returns @q.when([])
        _.defer => @rootScope.$digest()
        @sut.getNodes()

      if 'should set the scope.getNodes to the resolved values', ->
###
