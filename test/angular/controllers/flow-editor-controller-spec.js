describe('FlowEditorController', function(){
  var scope, sut, fakeFlowNodeTypeService;

  beforeEach(function(){
    module('octobluApp');

    inject(function($rootScope, $controller){
      scope = $rootScope.$new();
      scope.flow = {links: [], nodes: []};
      fakeFlowNodeTypeService = new FakeFlowNodeTypeService();
      sut   = $controller('FlowEditorController', {$scope: scope, FlowNodeTypeService: fakeFlowNodeTypeService});
    });
  });

  it('should instantiate', function(){
    expect(sut).to.exist;
  });

  describe('#addNode', function(){
    it('should call FlowNodeTypeService.createFlowNode', function () {
      scope.addNode({});
      expect(fakeFlowNodeTypeService.createFlowNode).to.have.been.calledOnce;
    });

    it('should call FlowNodeTypeService.createFlowNode', function () {
      scope.addNode({});
      scope.addNode({});
      expect(fakeFlowNodeTypeService.createFlowNode).to.have.been.calledTwice;
    });

    it('should call FlowNodeTypeService.createFlowNode with its argument', function () {
      scope.addNode({foo: 'bar'});
      expect(fakeFlowNodeTypeService.createFlowNode).to.have.been.calledWith({foo: 'bar'});
    });

    it('should call FlowNodeTypeService.createFlowNode with its argument', function () {
      scope.addNode({bar: 'foo'});
      expect(fakeFlowNodeTypeService.createFlowNode).to.have.been.calledWith({bar: 'foo'});
    });

    it('should add the result of createFlowNode to the flow nodes', function(){
      var returnValue = {my: 'return-value'};

      fakeFlowNodeTypeService.createFlowNode.returnValue = returnValue;
      scope.addNode({type: 'some-type'});

      expect(scope.flow.nodes[0].my).to.equal('return-value');
    });

    it('should add the events x and y coordinates to the flowNode', function () {
      scope.addNode({type: 'some-type'}, 102, 12);

      expect(scope.flow.nodes[0].x).to.equal(102);
      expect(scope.flow.nodes[0].y).to.equal(12);
    });

    it('should add the events x and y coordinates to the flowNode', function () {
      scope.addNode({type: 'some-type'}, 1, 2);

      expect(scope.flow.nodes[0].x).to.equal(1);
      expect(scope.flow.nodes[0].y).to.equal(2);
    });

    xit('should really add my node', function(){
      scope.addNode({type: 'some-other-type'});
      expect(scope.flow.nodes[0]).to.deep.equal({type: 'some-other-type'});
    });
  });
});

var FakeFlowNodeTypeService = function(){
  var _this = this;

  _this.createFlowNode = sinon.spy(function(flowNodeType){
    return _this.createFlowNode.returnValue || {};
  });

  return _this;
}
