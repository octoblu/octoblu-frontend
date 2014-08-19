describe('flowNodeEditorController', function () {
  var sut, scope, $httpBackend;

  beforeEach(function () {
    FakeFlowNodeTypeService.getFlowNodeType.called = false;

    module('octobluApp');

    inject(function($controller, $rootScope){
      scope = $rootScope.$new();
      scope.flowEditor = {}; // From parent
      sut = $controller('flowNodeEditorController', {$scope: scope, FlowNodeTypeService: FakeFlowNodeTypeService});
    });
  });

  beforeEach(function () {
    inject(function (_$httpBackend_, $rootScope) {
      $httpBackend = _$httpBackend_;
      $httpBackend.whenGET('/api/auth').respond(200);
      $httpBackend.whenGET('pages/octoblu.html').respond(200);
      $httpBackend.whenGET('pages/home.html').respond(200);
    });
  });

  it('should exist', function () {
    expect(sut).to.exist;
  });

  it('should instatiate a schemaControl on the scope', function(){
    expect(scope.schemaControl).to.exist;
  });

  it('should call not call getFlowNodeType', function () {
    expect(FakeFlowNodeTypeService.getFlowNodeType.called).to.be.false;
  });

  describe('when selectedNode gets set to a function node', function () {
    beforeEach(function () {
      scope.flowEditor.selectedNode = {type: 'function'};
      scope.$apply();
    });

    it('should attach a copy of the node to formFlowNode', function () {
      expect(scope.flowEditor.editorNode).to.exist;
      expect(scope.flowEditor.editorNode).not.to.equal(scope.flowEditor.selectedNode);
    });

    it('set set the flowNodeType on the scope', function () {
      expect(scope.flowEditor.flowNodeType).to.deep.equal({type: 'function'});
    });
  });

  describe('when selectedNode gets set, and then is then unset', function () {
    beforeEach(function () {
      scope.flowEditor.selectedNode = {type: 'inject'};
      scope.$apply();

      scope.flowEditor.selectedNode = null;
      scope.$apply();
    });

    it('should clear the flowNodeType', function () {
      expect(scope.flowEditor.flowNodeType).to.be.null;
    });
  });

  describe('updateNode', function () {
    describe('when an object is selected', function () {
      beforeEach(function () {
        scope.flowEditor.selectedNode = {name: 'Bah'};
        scope.$apply();
      });

      describe("when the editorNode is updated", function () {
        beforeEach(function () {
          scope.flowEditor.editorNode = {name: 'Boo'};
        });

        it('should updated the selectedNode', function () {
          var selectedNode = scope.flowEditor.selectedNode;
          scope.updateNode();
          expect(selectedNode.name).to.equal('Boo');
        });

        it('should clear the selected node', function () {
          scope.updateNode();
          expect(scope.flowEditor.selectedNode).to.be.null;
        });
      });

      describe("when schemaControl's getValue returns an updated name and timeout", function () {
        beforeEach(function () {
          scope.flowEditor.editorNode = {name: 'Delay', timeout: 2};
        });

        it('should updated the selectedNode', function () {
          var selectedNode = scope.flowEditor.selectedNode;
          scope.updateNode();
          expect(selectedNode).to.deep.equal({name: 'Delay', timeout: 2});
        });
      });
    });
  });
  var FakeFlowNodeTypeService = {
    getFlowNodeType: function(arg0){
      FakeFlowNodeTypeService.getFlowNodeType.called     = true;
      FakeFlowNodeTypeService.getFlowNodeType.calledWith = arg0;
      return {
        then: function(callback){
          FakeFlowNodeTypeService.getFlowNodeType.resolve = callback;
        }
      }
    }
  };

});
