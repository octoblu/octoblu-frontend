describe 'FlowController', ->
  beforeEach ->
    module 'octobluApp', ($provide) =>
      $provide.value '$cookies', {}
      $provide.value '$intercom', sinon.stub()
      $provide.value '$intercomProvider', sinon.stub()
      $provide.value 'reservedProperties', ['$$hashKey', '_id']
      return

    inject ($controller, $rootScope, $q) =>
      q = $q
      @scope = $rootScope.$new()
      @scope.flow = {}

      @stateParams = {}

      @fakeWindow = new FakeWindow
      @fakeFlowService = new FakeFlowService $q
      @fakeFlowNodeTypeService = new FakeFlowNodeTypeService $q
      @fakeSkynetService = new FakeSkynetService $q

      @sut = $controller('FlowController', {
        $scope : @scope
        $stateParams : @stateParams
        $stateParams : @stateParams
        $window : @fakeWindow
        FlowService : @fakeFlowService
        FlowNodeTypeService : @fakeFlowNodeTypeService
        skynetService: @fakeSkynetService
      })

  beforeEach ->
    inject ($httpBackend) =>
      $httpBackend.whenGET("/api/auth").respond 200
      $httpBackend.whenGET("/api/node_types").respond 200
      $httpBackend.whenGET("/pages/octoblu.html").respond 200
      $httpBackend.whenGET("/pages/home.html").respond 200

  it "should exist", ->
    expect(@sut).to.exist

  describe "deleteFlow", ->
    describe "when the user confirms the delete", ->
      beforeEach ->
        @fakeWindow.confirm.returns = true

      it "should call delete flow on the flow service", ->
        flow1 = flowId: "flowEyeD"
        @scope.deleteFlow flow1
        expect(@fakeFlowService.deleteFlow).to.have.been.calledWith "flowEyeD"

    describe "when the use does not confirm the delete", ->
      beforeEach ->
        @fakeWindow.confirm.returns = false

      it "should not call delete flow on the flow service", ->
        flow1 = flowId: "flowEyeD"
        @scope.deleteFlow flow1
        expect(@fakeFlowService.deleteFlow).not.to.have.been.called

  describe "deleteSelection", ->
    it "should be callable", ->
      @scope.deleteSelection()

    describe "when there is a selectedFlowNode", ->
      beforeEach ->
        @node1 = some: "node"
        @scope.activeFlow =
          flowId: "123"
          nodes: [@node1]
          links: []

        @scope.activeFlow.selectedFlowNode = @node1

      it "should set the selectedFlowNode to null", ->
        @scope.deleteSelection()
        expect(@scope.activeFlow.selectedFlowNode).to.be.null

      it "should delete the node from flow.nodes", ->
        @scope.deleteSelection()
        expect(@scope.activeFlow.nodes).to.be.empty

      describe "when there are multiple nodes in the flow", ->
        beforeEach ->
          @node2 = some: "otherNode"
          @scope.activeFlow =
            flowId: "123"
            nodes: [
              @node1
              @node2
            ]
            links: []

        describe "when node1 is selected", ->
          beforeEach ->
            @scope.activeFlow.selectedFlowNode = @node1

          it "should delete node1", ->
            @scope.deleteSelection()
            expect(@scope.activeFlow.nodes).not.to.include @node1
            expect(@scope.activeFlow.nodes).to.include @node2

        describe "when node2 is selected", ->
          beforeEach ->
            @scope.activeFlow.selectedFlowNode = @node2

          it "should delete node2", ->
            @scope.deleteSelection()
            expect(@scope.activeFlow.nodes).to.include @node1
            expect(@scope.activeFlow.nodes).not.to.include @node2

    describe "when there is a selectedLink", ->
      beforeEach ->
        @link1 = some: "link"
        @scope.activeFlow =
          flowId: "123"
          nodes: []
          links: [@link1]

        @scope.activeFlow.selectedLink = @link1

      it "should clear the selected link", ->
        @scope.deleteSelection()
        expect(@scope.activeFlow.selectedLink).to.be.null;

      it "should delete the link from flow.links", ->
        @scope.deleteSelection()
        expect(@scope.activeFlow.links).to.be.empty

      describe "when there are multiple links in the flow", ->
        beforeEach ->
          @link2 = some: "otherLink"
          @scope.activeFlow.links.push @link2

        describe "when link1 is selected", ->
          beforeEach ->
            @scope.activeFlow.selectedLink = @link1

          it "should delete link1", ->
            @scope.deleteSelection()
            expect(@scope.activeFlow.links).not.to.include @link1
            expect(@scope.activeFlow.links).to.include @link2

        describe "when link2 is selected", ->
          beforeEach ->
            @scope.activeFlow.selectedLink = @link2

          it "should delete link2", ->
            @scope.deleteSelection()
            expect(@scope.activeFlow.links).to.include @link1
            expect(@scope.activeFlow.links).not.to.include @link2

  describe "on instantiate", ->
    it "should call FlowService.getAllFlows", ->
      expect(@fakeFlowService.getAllFlows).to.have.been.called

    describe "when scope has flows and the stateParams has an flowId and getAllFlows returns", ->
      beforeEach ->
        flows = [
          {flowId: "cats"}
          {flowId: "dogs"}
        ]

        @stateParams.flowId = "dogs"
        flowDefer = @fakeFlowService.getAllFlows.deferred
        flowDefer.resolve flows

        @scope.$digest()

      it "should set the activeFlow to the second flow on the scope", ->
        expect(@scope.activeFlow).to.equal @scope.flows[1]

      describe 'when getSkynetConnection resolves', ->
        beforeEach ->
          @skynetConnection = new FakeSkynetConnection
          @fakeSkynetService.getSkynetConnection.deferred.resolve @skynetConnection
          @scope.$digest()

        it 'should call skynetConnection subscribe', ->
          expect(@skynetConnection.subscribe).to.have.been.called

        it 'should message the flow with a topic of subscribe:pulse', ->
          expect(@skynetConnection.message).to.have.been.calledWith {devices: ['dogs'], topic: 'subscribe:pulse'}

  class FakeWindow
    constructor: ->
      @confirm = sinon.spy @confirm
      @styles = {}
      @ownerDocument = {
        defaultView:
          getComputedStyle: =>
      }

    confirm: =>
      @confirm.returns

    # emulate jQuery
    height: =>
      0

    resize: =>
    style: =>

  class FakeFlowService
    constructor: ($q) ->
      @q = $q
      @deleteFlow  = sinon.spy @deleteFlow
      @getAllFlows = sinon.spy @getAllFlows

    deleteFlow: =>
      @deleteFlow.deferred = @q.defer()
      @deleteFlow.deferred.promise

    getAllFlows: =>
      @getAllFlows.deferred = @q.defer()
      @getAllFlows.deferred.promise

    setActiveFlow: =>

    hashFlow: (flow) =>
      return 1

  class FakeFlowNodeTypeService
    constructor: ($q) ->
      @q = $q

    getFlowNodeTypes: =>
      @getFlowNodeTypes.deferred = @q.defer()
      @getFlowNodeTypes.deferred.promise

  class FakeSkynetService
    constructor: ($q) ->
      @q = $q

    getSkynetConnection: =>
      @getSkynetConnection.deferred = @q.defer()
      @getSkynetConnection.deferred.promise

  class FakeSkynetConnection
    constructor: ->
      @subscribe = sinon.spy @subscribe
      @message = sinon.spy @message

    on: =>
    mydevices: =>
    message: =>
    subscribe: =>
