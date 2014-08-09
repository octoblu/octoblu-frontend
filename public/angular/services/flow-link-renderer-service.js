angular.module('octobluApp')
  .service('FlowLinkRenderer', function (FlowNodeDimensions) {
    var _this = this;

    var renderLine = d3.svg.line()
      .x(function (coordinate) {
        return coordinate.x;
      })
      .y(function (coordinate) {
        return coordinate.y;
      })
      .interpolate('basis');

    function getNodePortLocation(portStr, locations) {
      if (!portStr) {
        portStr = 0;
      }
      if (!locations) {
        return 0;
      }
      return locations[parseInt(portStr)] || 0;
    }

    function linkPath(link, flowNodes) {
      var sourceNode = _.findWhere(flowNodes, {id: link.from}),
        targetNode = _.findWhere(flowNodes, {id: link.to});

      var sourcePortLocation = getNodePortLocation(link.fromPort, sourceNode.outputLocations);

      var fromCoordinate = {
        x: sourceNode.x + FlowNodeDimensions.width,
        y: sourceNode.y + sourcePortLocation + (FlowNodeDimensions.portHeight / 2)
      };

      var fromCoordinateCurveStart = {
        x: fromCoordinate.x + FlowNodeDimensions.portHeight,
        y: fromCoordinate.y
      };

      var targetPortLocation = getNodePortLocation(link.toPort, targetNode.inputLocations);
      var toCoordinate = {
        x: targetNode.x,
        y: targetNode.y + targetPortLocation + (FlowNodeDimensions.portHeight / 2)
      };

      var toCoordinateCurveStart = {
        x: toCoordinate.x - FlowNodeDimensions.portHeight,
        y: toCoordinate.y
      };
      return renderLine([fromCoordinate, fromCoordinateCurveStart,
        toCoordinateCurveStart, toCoordinate]);
    };

    _this.render = function (renderScope, link, flowNodes) {
      return renderScope.append('path')
                        .classed('flow-link', true)
                        .attr('d', linkPath(link, flowNodes));
    };

    return _this;
  });
