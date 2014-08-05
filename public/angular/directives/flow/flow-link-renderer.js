angular.module('octobluApp')
  .service('FlowLinkRenderer', function () {
    var nodeType = {
      width: 100,
      height: 35
    };

    var renderLine = d3.svg.line()
      .x(function (coordinate) {
        return coordinate.x;
      })
      .y(function (coordinate) {
        return coordinate.y;
      })
      .interpolate('basis');

    function linkPath(link, flowNodes) {
      var sourceNode = _.findWhere(flowNodes, {id: link.from}),
        targetNode = _.findWhere(flowNodes, {id: link.to});

      var fromCoordinate = {
        x: sourceNode.x + nodeType.width,
        y: sourceNode.y + (nodeType.height / 2)
      };

      var fromCoordinateCurveStart = {
        x: fromCoordinate.x + nodeType.height,
        y: fromCoordinate.y
      };

      var toCoordinate = {x: targetNode.x, y: targetNode.y + (nodeType.height / 2)};

      var toCoordinateCurveStart = {x: toCoordinate.x - nodeType.height, y: toCoordinate.y};
      return renderLine([fromCoordinate, fromCoordinateCurveStart,
        toCoordinateCurveStart, toCoordinate]);
    }

    return {
      render: function (renderScope, link, flowNodes) {
            return renderScope
              .append('path')
              .classed('flow-link', true)
              .attr('d', linkPath(link, flowNodes));
        }
    };
  });
