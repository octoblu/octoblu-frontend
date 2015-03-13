describe('FlowNodeEditorController', function () {
  var sut, scope, fakeFlowNodeTypeService, $q, flowService, flowEditorService;

  beforeEach(function () {
    module('octobluApp');

    inject(function($controller, $rootScope, _$q_){
      $q = _$q_;
      fakeFlowNodeTypeService = new FakeFlowNodeTypeService();
      flowService = new FlowService();
      flowEditorService = new FlowEditorService();
      scope = $rootScope.$new();
      sut = $controller('FlowNodeEditorController', {
        $scope: scope,
        FlowService: flowService,
        FlowEditorService: flowEditorService,
        FlowNodeTypeService: fakeFlowNodeTypeService
      });
    });
  });

  it('should exist', function () {
    expect(sut).to.exist;
  });

  xdescribe('when a flowNode is set', function () {
    beforeEach(function () {
      scope.flowNode = { type: 'planet'};
      scope.$digest();
    });

    it('should find the matching flowNodeType from the FlowNodeType service', function () {
      expect(fakeFlowNodeTypeService.getFlowNodeType).to.have.been.calledWith('planet');
    });

    describe('when a flowNodeType is found', function(){
      it('should find the matching flowNodeType from the FlowNodeType service', function () {
        fakeFlowNodeTypeService.getFlowNodeType.successCallback({name: 'planet'});
        expect(scope.flowNodeType).to.deep.equal({name: 'planet'});
      });
    });
    describe('when a different flowNodeType is found', function(){
      it('should find the matching flowNodeType from the FlowNodeType service', function () {
        fakeFlowNodeTypeService.getFlowNodeType.successCallback({name: 'asteroid'});
        expect(scope.flowNodeType).to.deep.equal({name: 'asteroid'});
      });
    });
  });

  describe('when a different flowNode is set', function () {
    beforeEach(function () {
      scope.flowNode = { type: 'asteroid'};
      scope.$digest();
    });

    it('should find the matching flowNodeType from the FlowNodeType service', function () {
      expect(fakeFlowNodeTypeService.getFlowNodeType).to.have.been.calledWith('asteroid');
    });
  });

  describe('when a FlowNodeEditorController is instantiated with a flowNode already set', function () {
    beforeEach(function () {
      inject(function($controller, $rootScope){
        scope = $rootScope.$new();
        scope.flowNode     = {type: 'pluto'};
        scope.flowNodeType = {name: 'pluto'};
        fakeFlowNodeTypeService = new FakeFlowNodeTypeService();
        flowService = new FlowService();
        sut = $controller('FlowNodeEditorController', {
          $scope: scope,
          FlowService: flowService,
          FlowNodeTypeService: fakeFlowNodeTypeService
        });
      });
    });

    it('should call getFlowNodeType', function () {
      expect(fakeFlowNodeTypeService.getFlowNodeType).to.have.been.called;
    });

    describe('when flowNode is unset', function () {
      beforeEach(function () {
        scope.flowNode = null;
        scope.$digest();
      });

      it('should unset flowNodeType', function () {
        expect(scope.flowNodeType).not.to.exist;
      });
    });
  });

  var FakeFlowNodeTypeService = function(){
    var self = this;

    self.getFlowNodeType = function(type){
      return {
        then: function(successCallback){
          self.getFlowNodeType.successCallback = successCallback;
        }
      };
    };

    self.getOtherMatchingFlowNodeTypes = function(type){
      var defer = $q.defer();
      defer.resolve([]);
      return defer.promise;
    };

    sinon.spy(self, 'getFlowNodeType');
    return self;
  };

  var FlowService = function(){
    return this;
  };

  var FlowEditorService = function(){
    return this;
  };
});

