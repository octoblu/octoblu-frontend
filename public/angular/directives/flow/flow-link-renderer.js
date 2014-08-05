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

    return function (renderScope) {
      var dispatch = d3.dispatch('linkChanged');

      function render(links) {
        var flowNodes = getFlowNodes(links);

        renderScope.selectAll('.flow-link')
          .data(links)
          .attr('d', function (link) {
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
          });
      }

      function getFlowNodes() {
        var nodeElements = renderScope.selectAll('.flow-node');

        if (nodeElements.length) {
          return nodeElements.data();
        }

        return [];
      }

      return {
        add: function (links) {
          renderScope
            .append('path')
            .classed('flow-link', true)
            .data(links);
          render(links);
        },

        render: render,

        update: function (links) {
          render(links);
        },

        clear: function () {
          renderScope.select('.flow-link').remove();
        },

        on: function (event, callback) {
          return dispatch.on(event, callback);
        }
      };
    }
  });
