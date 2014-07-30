describe('FlowService', function () {
  var sut, $httpBackend;

  beforeEach(function () {
    module('octobluApp');

    inject(function(FlowService, _$httpBackend_){
      sut          = FlowService;
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('/api/auth').respond(200);
      $httpBackend.whenGET('pages/octoblu.html').respond(200);
      $httpBackend.whenGET('pages/home.html').respond(200);
      $httpBackend.flush();
    });
  });

  it('should instantiate', function () {
    expect(sut).to.exist;
  });

  describe('saveAllFlows', function () {
    describe('when it receives one workspace', function () {
      it('call $http.put for each flow', function () {
        $httpBackend.expectPUT("/api/flows/d5fe412a.2a01c").respond(204);
        var workspace = {id: "d5fe412a.2a01c", label: "Sheet 1", type: "tab"};
        sut.saveAllFlows([workspace]);
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });
    });

    describe('when it receives two workspaces', function () {
      it('call $http.get for each flow', function () {
        $httpBackend.expectPUT("/api/flows/one.value").respond(204);
        $httpBackend.expectPUT("/api/flows/two.value").respond(204);
        var workspaces = [
          {id: "one.value", label: "Sheet 1", type: "tab"},
          {id: "two.value", label: "Sheet 1", type: "tab"}
        ];
        sut.saveAllFlows(workspaces);
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });
    });
  });

  describe('designerToFlows', function () {
    describe('when called with no arguments', function () {
      it('should return an empty array', function () {
        expect(sut.designerToFlows()).to.deep.equal([]);
      });
    });

    describe('when called with only a workspace', function () {
      it('should return an array with one flow', function () {
        var workspace = {id: "d5fe412a.2a01c", label: "Sheet 1", type: "tab"};

        expect(sut.designerToFlows([workspace])).to.include({
          id:   'd5fe412a.2a01c',
          name: 'Sheet 1',
          nodes: []
        });
      });

      it('should return an array with one flow', function () {
        var workspace = {id: "differrent.id", label: "Other Sheet", type: "tab"};
        var designerNodes = [workspace];

        expect(sut.designerToFlows(designerNodes)).to.include({
          id:    'differrent.id',
          name:  'Other Sheet',
          nodes: []
        });
      });
    });

    describe('when its called with a workspace and a node', function () {
      it('should return an array with one flow', function () {
        var workspace = {id: "workspace.id", label: "Sheet", type: "tab"};
        var node      = {type:  "function", z: 'workspace.id'};
        var designerNodes = [workspace, node];

        expect(sut.designerToFlows(designerNodes)).to.include({
          id:    'workspace.id',
          name:  'Sheet',
          nodes: [{type: 'function'}]
        });
      });
    });
  });

  describe('extractNodesByWorkspaceId', function () {
    describe('when called with only a workspace and an id', function () {
      it('should return an empy array', function () {
        var workspace = {id: "workspace.id", label: "Sheet", type: "tab"};
        expect(sut.extractNodesByWorkspaceId(workspace, 'workspace.id')).to.deep.equal([]);
      });
    });

    describe('when called with a workspace, a node, and an id', function () {
      it('should return an empy array', function () {
        var workspace = {id: "workspace.id", label: "Sheet", type: "tab"};
        var node      = {type:  "function", z: 'workspace.id', x: 2};
        var designerNodes = [workspace, node];
        var result = sut.extractNodesByWorkspaceId(designerNodes, 'workspace.id');
        expect(result).to.deep.equal([{type: 'function', x: 2}]);
      });
    });
  });
});
