describe('FlowEditorController', function () {
  var sut, scope, FlowNodeDimensions;

  beforeEach(function () {
    module('octobluApp');

    inject(function($controller, $rootScope){
      fakeFlowNodeTypeService = new FakeFlowNodeTypeService();
      scope = $rootScope.$new();
      scope.flow = {nodes: [], zoomScale: 1};
      scope.snap = { transformCoords: function(x,y){
        return {x:x,y:y};
      }};

      sut = $controller('FlowEditorController', {
        $scope: scope,
        FlowNodeDimensions: {width:50,minHeight:50}
      });
    });
  });

  it('should exist', function () {
    expect(sut).to.exist;
  });

  describe('#addNode', function () {
    it('should call FakeFlowNodeTypeService.createFlowNode', function () {
      scope.addNode({}, 10, 10);
      expect(fakeFlowNodeTypeService.createFlowNode).to.have.been.called;
    });

    it('should set the x and y', function () {
      scope.addNode({}, 10, 10);
      var node = _.first(scope.flow.nodes);

      expect(node.x).to.equal(10);
      expect(node.y).to.equal(10);
    });

    it('should translate the x and y by the scaleFactor', function () {
      scope.zoomLevel = 1;
      scope.flow.zoomScale = 2;
      scope.addNode({}, 10, 10);
      var node = _.first(scope.flow.nodes);

      expect(node.x).to.equal(5);
      expect(node.y).to.equal(5);
    });
  });


  var FakeFlowNodeTypeService = function(){
    var _this = this;

    _this.createFlowNode = sinon.spy(function(){
      return {};
    });

    return _this;
  }
});
