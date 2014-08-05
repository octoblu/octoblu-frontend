describe('FlowLinkRenderer', function () {
  var sut, renderScope;

  beforeEach(function(){
    module('octobluApp');
    renderScope = d3.select('body').append('svg');
  });

  afterEach(function(){
    renderScope.remove();
  });

  describe('when flow has empty nodes', function () {
    beforeEach(function () {
      inject(function (_FlowLinkRenderer_) {
        sut = _FlowLinkRenderer_(renderScope);
      });
    });

    it('should return an array with an empty array for some reason', function () {
      sut.render([]);
      expect(renderScope.selectAll('.flow-link')[0].length).to.equal(0);
    });
  });

  describe('when flow has an invalid node', function () {
    beforeEach(function () {
      inject(function (_FlowLinkRenderer_) {
        sut = _FlowLinkRenderer_(renderScope);
      });
    });

    it('should return an empty object', function () {
      sut.render([{}]);
      expect(renderScope.selectAll('.flow-link').empty()).to.equal(true);
    });
  });

  describe('when flow has a valid node', function () {

    beforeEach(function () {
      renderScope.append('g')
        .data([{id: '1', x: 500, y: 500}])
        .classed('flow-node', true);

      inject(function (_FlowLinkRenderer_) {
        sut = _FlowLinkRenderer_(renderScope);
      });
    });

    it('should return a link object', function () {
      sut.add([{ from: '1', to: '1'}]);
      console.log(renderScope.selectAll('.flow-link').data())
      expect(renderScope.selectAll('.flow-link').length).to.deep.equal(1);
    });
  });
});