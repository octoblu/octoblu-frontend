xdescribe 'FlowController', ->
  beforeEach ->
    module 'octobluApp', ($provide) =>
      $provide.value '$cookies', {}
      $provide.value 'reservedProperties', ['$$hashKey', '_id']
      $provide.value 'OCTOBLU_ICON_URL', ''
      $provide.value 'MESHBLU_HOST', 'http://whatever.com'
      $provide.value 'MESHBLU_PORT', 1111
      $provide.value 'SERVICE_UUIDS', ''
      return

    inject ($controller, $rootScope, $q) =>
      @q = $q
      @scope = $rootScope.$new()
      @scope.flow = {}

      @stateParams = {}

      @fakeWindow = new FakeWindow
      @fakeFlowService = new FakeFlowService $q
      @flowEditorService = new FlowEditorService
      @fakeFlowNodeTypeService = new FakeFlowNodeTypeService $q
      @fakeNotifyService = new FakeNotifyService $q
      @fakeNodeRegistryService = new FakeNodeRegistryService $q

      @sut = $controller('FlowController', {
        $scope : @scope
        $stateParams : @stateParams
        $window : @fakeWindow
        FlowService : @fakeFlowService
        FlowEditorService: @flowEditorService
        FlowNodeTypeService : @fakeFlowNodeTypeService
        NotifyService : @fakeNotifyService
        NodeRegistryService: @fakeNodeRegistryService
      })

  beforeEach ->
    inject ($httpBackend) =>
      $httpBackend.whenGET("/api/auth").respond 200
      $httpBackend.whenGET("/api/node_types").respond 200
      $httpBackend.whenGET("/pages/material.html").respond 200

  it "should exist", ->
    expect(@sut).to.exist

  describe "deleteFlow", ->
    describe "when the user confirms the delete", ->
      beforeEach ->

      it "should call delete flow on the flow service", ->
        flow1 = flowId: "flowEyeD"
        @scope.deleteFlow flow1
        @scope.$digest()
        expect(@fakeFlowService.deleteFlow).to.have.been.calledWith "flowEyeD"

    describe "when the use does not confirm the delete", ->
      beforeEach ->
        @fakeWindow.confirm.returns = false

      it "should not call delete flow on the flow service", ->
        flow1 = flowId: "flowEyeD"
        @scope.deleteFlow flow1
        expect(@fakeFlowService.deleteFlow).not.to.have.been.called

  describe "->deleteSelection", ->
    describe 'when called with an activeFlow', ->
      beforeEach ->
        @scope.activeFlow = { flowId: 123 }
        @flowEditorService.deleteSelection = sinon.stub().returns { flowId: 123 }
        @scope.deleteSelection()

      it 'should call FlowEditorService.deleteSelection()', ->
        expect(@flowEditorService.deleteSelection).to.have.been.calledWith { flowId: 123 }

    describe 'when called without an activeFlow', ->
      beforeEach ->
        @flowEditorService.deleteSelection = sinon.stub().returns { flowId: 123 }
        @scope.deleteSelection()

      it 'should call FlowEditorService.deleteSelection()', ->
        expect(@flowEditorService.deleteSelection).to.not.have.been.called

  describe "on instantiate", ->
    it "should call FlowService.getFlow", ->
      expect(@fakeFlowService.getFlow).to.have.been.called

    describe "when scope has flows and the stateParams has an flowId and getAllFlows returns", ->
      beforeEach ->
        flows = [
          {flowId: "cats"}
          {flowId: "dogs"}
        ]

        @stateParams.flowId = "dogs"

        flowDefer = @fakeFlowService.getFlow.deferred
        flowDefer.resolve {flowId: 'dogs'}

        @scope.$digest()

      it "should set the activeFlow to the second flow on the scope", ->
        expect(@scope.activeFlow).to.deep.equal {flowId: 'dogs'}

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
      @getFlow = sinon.spy @getFlow
      @needsPermissions = sinon.spy @needsPermissions

    deleteFlow: =>
      @deleteFlow.deferred = @q.defer()
      @deleteFlow.deferred.promise

    getAllFlows: =>
      @getAllFlows.deferred = @q.defer()
      @getAllFlows.deferred.promise

    getFlow: =>
      @getFlow.deferred = @q.defer()
      @getFlow.deferred.promise

    needsPermissions: =>
      @needsPermissions.deferred = @q.defer()
      @needsPermissions.deferred.promise

    setActiveFlow: =>

    subscribeFlowToDevices: =>

    onStep: =>

    hashFlow: (flow) =>
      return 1

  class FlowEditorService
    deleteSelection: =>

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

  class FakeNotifyService
    constructor: (@q) ->
      @confirm = sinon.stub().returns @q.when()

  class FakeNodeRegistryService
    constructor: (@q) ->
    needsPermissions: =>
      @q.when()
