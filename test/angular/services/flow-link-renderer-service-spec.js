describe('FlowLinkRenderer', function () {
  var sut, renderScope;

  beforeEach(function () {
    module('octobluApp');
    renderScope = new Snap();
    renderScope.group().addClass('flow-link-area');
  });

  afterEach(function () {
    renderScope.remove();
  });

  describe('a node with a link', function () {
    beforeEach(function () {
      inject(function (_FlowLinkRenderer_) {
        sut = _FlowLinkRenderer_;
      });
    });

    it('should render a link', function () {
      var flow = {nodes: [{id: '1'} ]};
      sut.render(renderScope, {from: '1', to: '1'}, flow);
      expect(renderScope.selectAll('.flow-link').length).to.equal(1);
    });
  });

  describe('A link positioned on an input', function () {
    var renderLine;

    function getPathEndpoints(path) {
      var pathSteps = path.split(/[a-z,A-Z]/g);
      var startCoords = pathSteps[1].split(' ');
      var coordinates = [];
      coordinates.push({
        x: parseFloat(startCoords[0].trim()),
        y: parseFloat(startCoords[1].trim())
      });
      var endCoords =
        pathSteps[pathSteps.length - 1].split(' ');
      coordinates.push({
        x: parseFloat(endCoords[0].trim()),
        y: parseFloat(endCoords[1].trim())
      });
      return coordinates;
    }

    beforeEach(function () {
      inject(function (_FlowLinkRenderer_) {
        renderLine = d3.svg.line()
          .x(function (coordinate) {
            return coordinate.x;
          })
          .y(function (coordinate) {
            return coordinate.y;
          })
          .interpolate('basis');

        sut = _FlowLinkRenderer_;
      });
    });

    it('should render a link from the correct port', function () {
      var flow = {nodes: [
        {id: '1', x: 0, y: 0, inputLocations: [15], outputLocations: [15]}
      ]};
      sut.render(renderScope, {from: '1', to: '1', fromPort: '0'}, flow);
      var link = renderScope.selectAll('.flow-link')[0];
      var path = link.attr('d');
      var pathCoordinates = getPathEndpoints(path);
      expect(pathCoordinates[0].y).to.equal(35);
      expect(pathCoordinates[1].y).to.equal(35);
    });

    it('should render a link from the correct port when 2 nodes', function () {
      var flow = {nodes: [
        {id: '1', x: 0, y: 0, outputLocations: [15]},
        {id: '2', x: 0, y: 0, inputLocations: [15,30]}
      ]};

      sut.render(renderScope, {from: '1', to: '2', fromPort: '0', toPort: '1'}, flow);
      var link = renderScope.selectAll('.flow-link')[0];
      var path = link.attr('d');
      var pathCoordinates = getPathEndpoints(path);
      expect(pathCoordinates[0].y).to.equal(35);
      expect(pathCoordinates[1].y).to.equal(35);
    });

    it('should render a link from the correct port when 2 nodes are not at 0,0', function () {
      var flow = {nodes: [
        {id: '1', x: 100, y: 100, outputLocations: [15]},
        {id: '2', x: 200, y: 200, inputLocations: [15,30]}
      ]};

      sut.render(renderScope, {from: '1', to: '2', fromPort: '0', toPort: '1'}, flow);
      var link = renderScope.selectAll('.flow-link')[0];
      var path = link.attr('d');
      var pathCoordinates = getPathEndpoints(path);
      expect(pathCoordinates[0].y).to.equal(135);
      expect(pathCoordinates[1].y).to.equal(235);
    });
  });
});
