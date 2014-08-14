describe('FlowController', function () {
  var sut, scope, fakeFlowService, fakeFlowNodeTypeService, fakeWindow;

  beforeEach(function () {
    module('octobluApp');

    inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      scope.flow = {}; // From parent

      fakeWindow              = new FakeWindow();
      fakeFlowService         = new FakeFlowService();
      fakeFlowNodeTypeService = new FakeFlowNodeTypeService();

      sut = $controller('FlowController', {
        $scope: scope,
        $window : fakeWindow,
        FlowService: fakeFlowService,
        FlowNodeTypeService: fakeFlowNodeTypeService
      });
    });
  });

  beforeEach(function () {
    inject(function ($httpBackend) {
      $httpBackend.whenGET('/api/auth').respond(200);
      $httpBackend.whenGET('pages/octoblu.html').respond(200);
      $httpBackend.whenGET('pages/home.html').respond(200);
    });
  });

  it('should exist', function () {
    expect(sut).to.exist;
  });

  describe('deleteFlow', function(){

    describe('when the user confirms the delete', function () {
      beforeEach(function(){
        fakeWindow.confirm.returns = true;
      });

      it('should call delete flow on the flow service', function(){
        var flow1 = {flowId: 'flowEyeD'};
        scope.deleteFlow(flow1);
        expect(fakeFlowService.deleteFlow).to.have.been.calledWith('flowEyeD');
      });
    });

    describe('when the use does not confirm the delete', function () {
      beforeEach(function(){
        fakeWindow.confirm.returns = false;
      });

      it('should call delete flow on the flow service', function(){
        var flow1 = {flowId: 'flowEyeD'};
        scope.deleteFlow(flow1);
        expect(fakeFlowService.deleteFlow).not.to.have.been.called;
      });
    });

    describe('when the flow service responds', function () {
      beforeEach(function(){
        var flow1 = {flowId: 'flowEyeD'};
        fakeWindow.confirm.returns = true;
        fakeFlowService.getAllFlows.reset();
        scope.deleteFlow(flow1)
        fakeFlowService.deleteFlow.successCallback();
      });

      it('should call getAllFlows on the FlowService', function () {
        expect(fakeFlowService.getAllFlows).to.have.been.called;
      });
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

  var FakeFlowNodeTypeService = function(){
    var _this = this;

    _this.getFlowNodeTypes = sinon.spy(function(){
      return {
        then: function(callback){
          _this.getFlowNodeTypes.resolve = callback;
        }
      };
    });

    return _this;
  };

  var FakeFlowService = function(){
    var _this = this;

    _this.deleteFlow = sinon.spy(function(){
      return {
        then: function(successCallback){
          _this.deleteFlow.successCallback = successCallback;
        }
      }
    });

    _this.getAllFlows = sinon.spy(function(){
      return {
        then: function(){}
      };
    });

    _this.getSessionFlow = function(){
      return {
        then: function(){}
      };
    }

    return _this;
  };

  var FakeWindow = function(){
    var _this = this;

    _this.confirm = sinon.spy(function(){
      return _this.confirm.returns;
    });

    return _this;
  };
});
