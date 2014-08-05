describe('FlowLinkRenderer', function () {
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
      inject(function (_FlowLinkRenderer_) {
        sut = _FlowLinkRenderer_;
      });
    });

    it('should render a link', function () {
      sut.render(renderScope, {from: '1', to: '1'}, [{id: '1'}]);
      expect(renderScope.selectAll('.flow-link').data().length).to.equal(1);
    });
  });
});