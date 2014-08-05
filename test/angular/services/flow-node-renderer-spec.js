describe('FlowNodeRenderer', function () {
  var sut, renderScope;

  beforeEach(function(){
    module('octobluApp');
    renderScope = d3.select('body').append('svg');
  });

  afterEach(function(){
    renderScope.remove();
  });

  describe('a node with a link', function () {
    beforeEach(function () {
      inject(function (_FlowNodeRenderer_) {
        sut = _FlowNodeRenderer_;
      });
    });

    it('should render a node', function () {
      sut.render(renderScope, {id: '1'});
      expect(renderScope.selectAll('.flow-node').data().length).to.equal(1);
    });
  });
});