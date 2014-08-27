describe('OmniboxController', function () {
  var scope, sut, fakeFlowNodeTypeService, fakeNodeTypeService;

  beforeEach(function () {
    module('octobluApp');

    inject(function($rootScope, $controller){
      scope = $rootScope.$new();
      fakeFlowNodeTypeService = new FakeFlowNodeTypeService();
      fakeNodeTypeService = new FakeNodeTypeService();

      sut = $controller('OmniboxController', {
        $scope: scope,
        FlowNodeTypeService: fakeFlowNodeTypeService,
        NodeTypeService: fakeNodeTypeService
      });

    });
  });

  it('should exist', function () {
    expect(sut).to.exist;
  });

  describe('when scope.flowNodes has a node', function () {
    beforeEach(function () {
      scope.flowNodes = [{ type: 'liter' }];
      scope.$digest();
    });

    it('should put it in the omniList', function () {
      expect(scope.omniList).to.deep.contain.members(scope.flowNodes);
    });
  });

  describe('when flowNodes has different nodes', function () {
    beforeEach(function () {
      scope.flowNodes = [{ type: 'liter' }, {type: 'lighter'}];
      scope.$digest();
    });

    it('should put them in the omniList', function () {
      expect(scope.omniList).to.deep.contain.members(scope.flowNodes);
    });
  });

  describe('when the FlowNodeTypeService responds', function () {
    var flowNodeTypes;

    beforeEach(function () {
      flowNodeTypes = [{ type: 'function'}];
      fakeFlowNodeTypeService.getFlowNodeTypes.successCallback(flowNodeTypes);
    });

    it('should inject them into the omniList', function () {
      expect(scope.omniList).to.deep.contain.members(flowNodeTypes);
    });
  });

  describe('when the FlowNodeTypeService responds with a "thee bug" node', function () {
    var flowNodeTypes;

    beforeEach(function () {
      flowNodeTypes = [{ type: 'thee bug'}];
      fakeFlowNodeTypeService.getFlowNodeTypes.successCallback(flowNodeTypes);
    });

    it('should inject it into the omniList', function () {
      expect(scope.omniList).to.deep.contain.members(flowNodeTypes);
    });
  });

  describe('when the NodeTypeService responds with a "Bitly" node', function () {
    var flowNodeTypes;

    beforeEach(function () {
      nodeTypes = [{ type: 'channel:bitly'}];
      fakeNodeTypeService.getNodeTypes.successCallback(nodeTypes);
    });

    it('should inject it into the omniList', function () {
      expect(scope.omniList).to.deep.contain.members(nodeTypes);
    });
  });

  describe('when the NodeTypeService responds with a "taco_bell" node', function () {
    var flowNodeTypes;

    beforeEach(function () {
      nodeTypes = [{ type: 'channel:taco_bell'}];
      fakeNodeTypeService.getNodeTypes.successCallback(nodeTypes);
    });

    it('should inject it into the omniList', function () {
      expect(scope.omniList).to.deep.contain.members(nodeTypes);
    });
  });

  describe('when the NodeTypeService and FlowNodeTypeService respond with data', function () {
    var flowNodeTypes, nodeTypes;

    beforeEach(function () {
      nodeTypes = [{ type: 'channel:taco_bell'}];
      fakeNodeTypeService.getNodeTypes.successCallback(nodeTypes);

      flowNodeTypes = [{ type: 'thee bug'}];
      fakeFlowNodeTypeService.getFlowNodeTypes.successCallback(flowNodeTypes);
    });

    it('should inject nodeTypes into the omniList', function () {
      expect(scope.omniList).to.deep.contain.members(nodeTypes);
    });

    it('should inject flowNodeTypes into the omniList', function () {
      expect(scope.omniList).to.deep.contain.members(flowNodeTypes);
    });
  });

  describe('when flowNodes has nodes and the NodeTypeService responds', function () {
    beforeEach(function () {
      nodeTypes = [{ type: 'channel:taco_bell'}];
      fakeNodeTypeService.getNodeTypes.successCallback(nodeTypes);

      scope.flowNodes = [{ type: 'liter' }];
      scope.$digest();
    });

    it('should put flowNodes into the omniList', function () {
      expect(scope.omniList).to.deep.contain.members(scope.flowNodes);
    });

    it('should inject nodeTypes into the omniList', function () {
      expect(scope.omniList).to.deep.contain.members(nodeTypes);
    });
  });

  var FakeFlowNodeTypeService = function(){
    var self = this;
    self.getFlowNodeTypes = function() {
      return {
        then: function(successCallback){
          self.getFlowNodeTypes.successCallback = successCallback;
        }
      };
    };
  };

  var FakeNodeTypeService = function(){
    var self = this;
    self.getNodeTypes = function() {
      return {
        then: function(successCallback){
          self.getNodeTypes.successCallback = successCallback;
        }
      };
    };
  };

});
