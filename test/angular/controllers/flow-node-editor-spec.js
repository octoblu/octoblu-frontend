describe('flowNodeEditorController', function () {
  var sut, scope, $httpBackend;

  beforeEach(function () {
    FakeFlowNodeTypeService.getFlowNodeType.called = false;

    module('octobluApp');

    inject(function($controller, $rootScope){
      scope = $rootScope.$new();
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

  it('should instantiate the selected node', function () {
    expect(scope.selectedNode).to.be.null;
  });

  it('should call not call getFlowNodeType', function () {
    expect(FakeFlowNodeTypeService.getFlowNodeType.called).to.be.false;
  });

  describe('when selectedNode gets set to a function node', function () {
    beforeEach(function () {
      scope.selectedNode = {type: 'function'};
      scope.$apply();
    });

    it('should call getFlowNodeType with the flowNodeType', function () {
      expect(FakeFlowNodeTypeService.getFlowNodeType.called).to.be.true;
      expect(FakeFlowNodeTypeService.getFlowNodeType.calledWith).to.equal('function');
    });

    describe('when getFlowNodeTypes resolves', function () {
      beforeEach(function () {
        FakeFlowNodeTypeService.getFlowNodeType.resolve({foo: 'bar'});
      });

      it('set set the flowNodeType on the scope', function () {
        expect(scope.flowNodeType).to.deep.equal({foo: 'bar'});
      });
    });
  });

  describe('when selectedNode gets set to a function node', function () {
    beforeEach(function () {
      scope.selectedNode = {type: 'inject'};
      scope.$apply();
    });

    it('should call getFlowNodeType with the flowNodeType', function () {
      expect(FakeFlowNodeTypeService.getFlowNodeType.called).to.be.true;
      expect(FakeFlowNodeTypeService.getFlowNodeType.calledWith).to.equal('inject');
    });

    describe('when getFlowNodeTypes resolves', function () {
      beforeEach(function () {
        FakeFlowNodeTypeService.getFlowNodeType.resolve({bar: 'foo'});
      });

      it('set set the flowNodeType on the scope', function () {
        expect(scope.flowNodeType).to.deep.equal({bar: 'foo'});
      });
    });
  });

  describe('when selectedNode gets set, resolves and then is then unset', function () {
    beforeEach(function () {
      scope.selectedNode = {type: 'inject'};
      scope.$apply();

      FakeFlowNodeTypeService.getFlowNodeType.resolve({foo: 'bar'});

      scope.selectedNode = null;
      scope.$apply();
    });

    it('should clear the flowNodeType', function () {
      expect(scope.flowNodeType).to.be.null;
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
}

