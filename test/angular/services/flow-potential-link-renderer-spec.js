describe('FlowPotentialLinkRenderer', function () {
  var sut, renderScope;

  beforeEach(function () {
    module('octobluApp');
    renderScope = d3.select('body').append('svg');
  });

  afterEach(function () {
    renderScope.remove();
  });

  describe('A link positioned on an input', function () {
    var renderLine;

    function getPathEndpoints(path) {
      var pathSteps = path.split(/[a-zA-Z]/g);
      var startCoords = pathSteps[1].split(',');
      var coordinates = [];
      coordinates.push({
        x: parseFloat(startCoords[0]),
        y: parseFloat(startCoords[1])
      });
      var endCoords =
        pathSteps[pathSteps.length - 1].split(',');
      coordinates.push({
        x: parseFloat(endCoords[0]),
        y: parseFloat(endCoords[1])
      });

      return coordinates;
    }

    beforeEach(function () {
      inject(function (_FlowPotentialLinkRenderer_) {
        renderLine = d3.svg.line()
          .x(function (coordinate) {
            return coordinate.x;
          })
          .y(function (coordinate) {
            return coordinate.y;
          })
          .interpolate('basis');

        sut = _FlowPotentialLinkRenderer_;
      });
    });

    it('should render a link from the correct port', function () {
      sut.render(renderScope,
        {from: '1', fromPort: '0', to: {x: 0, y: 0}},
        {id: '1', outputLocations : [15], x: 0, y: 0}
      );
      var link = $(renderScope.selectAll('.flow-potential-link')[0]);
      var path = link.attr('d');
      var pathCoordinates = getPathEndpoints(path);
      expect(pathCoordinates[0].y).to.equal(20);
      expect(pathCoordinates[1].y).to.equal(0);
    });
  });
});