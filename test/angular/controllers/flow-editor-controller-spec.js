describe('FlowEditorController', function(){
  var scope, sut;

  beforeEach(function(){
    module('octobluApp');

    inject(function($rootScope, $controller){
      scope = $rootScope.$new();
      scope.flow = {links: [], nodes: []};
      sut   = $controller('FlowEditorController', {$scope: scope});
    });
  });

  it('should instantiate', function(){
    expect(sut).to.exist;
  });

  describe('Adding a node to a flow', function(){
    it('should add my node', function(){
      scope.addNode({type: 'some-type'});
      expect(scope.flow.nodes[0]).to.deep.equal({type: 'some-type'});
    });

    it('should really add my node', function(){
      scope.addNode({type: 'some-other-type'});
      expect(scope.flow.nodes[0]).to.deep.equal({type: 'some-other-type'});
    });
  });
});