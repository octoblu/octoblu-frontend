describe('flowController', function () {
  var sut, scope, $httpBackend;

  beforeEach(function () {
    module('octobluApp');

    inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      scope.flow = {}; // From parent
      sut = $controller('flowController', {
        $scope: scope,
        FlowService: FakeFlowService,
        FlowNodeTypeService: FakeFlowNodeTypeService
      });
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
    }
  };
});