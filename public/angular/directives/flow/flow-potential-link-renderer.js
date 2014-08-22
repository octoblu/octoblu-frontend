angular.module('octobluApp')
  .service('LinkRenderer', function (FlowNodeDimensions) {

    var renderLine = d3.svg.line()
      .x(function (coordinate) {
        return coordinate.x;
      })
      .y(function (coordinate) {
        return coordinate.y;
      })
      .interpolate('basis');


    function linkPath(from, to) {

      var fromCoordinateCurveStart = {
        x: from.x + FlowNodeDimensions.minHeight,
        y: from.y
      };

      var toCoordinate = {
        x: to.x,
        y: to.y
      };

      var toCoordinateCurveStart = {
        x: toCoordinate.x - FlowNodeDimensions.minHeight,
        y: toCoordinate.y
      };

      return renderLine([from, fromCoordinateCurveStart,
        toCoordinateCurveStart, to]);
    }

    return {
      render: function (renderScope, from, to) {
        return renderScope
          .append('path')
          .classed('flow-link', true)
          .classed('flow-potential-link', true)
          .attr('d', linkPath(from, to));
      }
    };
  });
