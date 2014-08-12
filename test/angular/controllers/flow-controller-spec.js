describe('FlowController', function () {
  var sut, scope, $httpBackend, FlowModel, FakeWindow;

  beforeEach(function () {
    module('octobluApp');

    inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      scope.flow = {}; // From parent

      FakeWindow = {
        confirm : sinon.stub()
      };
      FakeWindow.confirm.returns(true);
      sut = $controller('FlowController', {
        $scope: scope,
        FlowService: FakeFlowService,
        FlowNodeTypeService: FakeFlowNodeTypeService,
        $window : FakeWindow
      });
    });
  });

  beforeEach(function () {
    inject(function (_$httpBackend_, $rootScope, _FlowModel_) {
      FlowModel = _FlowModel_;
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('/api/auth').respond(200);
      $httpBackend.whenGET('pages/octoblu.html').respond(200);
      $httpBackend.whenGET('pages/home.html').respond(200);
    });
  });

  it('should exist', function () {
    expect(sut).to.exist;
  });

  describe('deleteFlow', function(){
    var flow1, flow2;
    beforeEach(function(){
      flow1 = FlowModel('Test Flow');
      scope.flows = [flow1];
    });

    it('should delete a flow', function(){
      var flow2 = FlowModel('Second Flow');
      scope.flows.push(flow2);
      scope.deleteFlow(flow1);
      expect(scope.flows[0]).to.eq(flow2);
    });

    it('should ask for confirmation', function(){
      scope.deleteFlow(flow1);
      expect(FakeWindow.confirm).to.be.called;
    });

    it('should not delete a flow if the user cancels', function(){
      FakeWindow.confirm.returns(false);
      scope.deleteFlow(flow1);
      expect(scope.flows[0]).to.eq(flow1);
    });
    it('should create a blank flow if the last flow is deleted', function(){
      scope.deleteFlow(flow1);
      expect(scope.flows.length).to.equal(1);
      expect(scope.flows[0]).to.not.equal(flow1);
    });





  });
  describe('deleteSelection', function () {
    it('should be callable', function () {
      scope.deleteSelection();
    });

    describe('when there is a selectedNode', function () {
      var node1;

      beforeEach(function () {
        node1 = {some: 'node'};
        scope.activeFlow = {flowId: '123', nodes: [node1], links: []};
        scope.flowEditor.selectedNode = node1;
      });

      it('should set the selectedNode to null', function () {
        scope.deleteSelection();
        expect(scope.flowEditor.selectedNode).to.be.null;
      });

      it('should delete the node from flow.nodes', function () {
        scope.deleteSelection();
        expect(scope.activeFlow.nodes).to.be.empty;
      });

      describe('when there are multiple nodes in the flow', function () {
        beforeEach(function () {
          node2 = {some : 'otherNode'};
          scope.activeFlow = {flowId : '123', nodes: [node1, node2], links: []};
        });

        describe('when node1 is selected', function () {
          beforeEach(function () {
            scope.flowEditor.selectedNode = node1;
          });

          it('should delete node1', function () {
            scope.deleteSelection();
            expect(scope.activeFlow.nodes).not.to.include(node1);
            expect(scope.activeFlow.nodes).to.include(node2);
          });
        });

        describe('when node2 is selected', function () {
          beforeEach(function () {
            scope.flowEditor.selectedNode = node2;
          });

          it('should delete node2', function () {
            scope.deleteSelection();
            expect(scope.activeFlow.nodes).to.include(node1);
            expect(scope.activeFlow.nodes).not.to.include(node2);
          });
        });
      });
    });

    describe('when there is a selectedLink', function () {
      beforeEach(function () {
        link1 = {some: 'link'};
        scope.activeFlow = {flowId: '123', nodes: [], links: [link1]};
        scope.flowEditor.selectedLink = link1;
      });

      it('should clear the selected link', function () {
        scope.deleteSelection();
        expect(scope.flowEditor.selectedLink).to.be.null;
      });

      it('should delete the link from flow.links', function () {
        scope.deleteSelection();
        expect(scope.activeFlow.links).to.be.empty;
      });

      describe('when there are multiple links in the flow', function () {
        beforeEach(function () {
          link2 = {some : 'otherLink'};
          scope.activeFlow.links.push(link2);
        });

        describe('when link1 is selected', function () {
          beforeEach(function () {
            scope.flowEditor.selectedLink = link1;
          });

          it('should delete link1', function () {
            scope.deleteSelection();
            expect(scope.activeFlow.links).not.to.include(link1);
            expect(scope.activeFlow.links).to.include(link2);
          });
        });

        describe('when link2 is selected', function () {
          beforeEach(function () {
            scope.flowEditor.selectedLink = link2;
          });

          it('should delete link2', function () {
            scope.deleteSelection();
            expect(scope.activeFlow.links).to.include(link1);
            expect(scope.activeFlow.links).not.to.include(link2);
          });
        });
      });
    });
  });

  var FakeFlowNodeTypeService = {
    getFlowNodeTypes: function(arg0){
      FakeFlowNodeTypeService.getFlowNodeTypes.called     = true;
      FakeFlowNodeTypeService.getFlowNodeTypes.calledWith = arg0;
      return {
        then: function(callback){
          FakeFlowNodeTypeService.getFlowNodeTypes.resolve = callback;
        }
      }
    }
  };

  var FakeFlowService = {
    getAllFlows: function(arg0){
      return {
        then: function(callback){
          FakeFlowService.getAllFlows.resolve = callback;
        }
      }
    },
    getSessionFlow: function(arg0){
      return {
        then: function(callback){
          FakeFlowService.getSessionFlow.resolve = callback;
        }
      }
    },
    newFlow : function(name){
      return FlowModel(name);
    },
    deleteFlow : function(flow){

    }
  };

});
