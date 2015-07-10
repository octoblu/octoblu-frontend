describe('LinkRenderer', function () {
  var sut, renderScope;

  beforeEach(function () {
    module('octobluApp');
    //renderScope = d3.select('body').append('svg');
    renderScope = new Snap();
    renderScope.group().addClass('flow-render-area')
      .group().addClass('flow-link-area');
    renderScope.attr({viewBox:"0 0 10000 10000"});
  });

  afterEach(function () {
    renderScope.selectAll('*').remove();
  });

  describe('A link positioned on an input', function () {
    var renderLine;

    function getPathEndpoints(path) {
      var pathSteps = path.split(/[a-z,A-Z]/g);
      var startCoords = pathSteps[1].split(' ');
      var coordinates = [];
      coordinates.push({
        x: parseFloat(startCoords[0]),
        y: parseFloat(startCoords[1])
      });
      var endCoords =
        pathSteps[pathSteps.length - 1].split(' ');
      coordinates.push({
        x: parseFloat(endCoords[0]),
        y: parseFloat(endCoords[1])
      });

      return coordinates;
    }

    beforeEach(function () {
      inject(function (_LinkRenderer_) {
        renderLine = d3.svg.line()
          .x(function (coordinate) {
            return coordinate.x;
          })
          .y(function (coordinate) {
            return coordinate.y;
          })
          .interpolate('basis');

        sut = _LinkRenderer_;
      });
    });

    it('should render a link from the correct port', function () {
      sut.render(renderScope,
        {x: 2, y: 5},
        {x: 1, y: 7}
      );
      var link = renderScope.selectAll('.flow-link')[0];
      var path = link.attr('d');
      var pathCoordinates = getPathEndpoints(path);
      expect(pathCoordinates[0].x).to.equal(2);
      expect(pathCoordinates[0].y).to.equal(5);
      expect(pathCoordinates[1].x).to.equal(1);
      expect(pathCoordinates[1].y).to.equal(7);
    });
  });
});
