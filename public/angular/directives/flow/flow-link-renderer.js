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

      function update(links) {
        links
          .classed('flow-link', true)
          .attr('d', function (link) {
            var flowNodes = renderScope.selectAll('.flow-node').data(),
              sourceNode = _.findWhere(flowNodes, {id: link.from}),
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

            return renderLine([fromCoordinate, fromCoordinateCurveStart, toCoordinateCurveStart, toCoordinate]);
          });
      }

      return {
        render: function (links) {
          var linkData = renderScope.selectAll('.flow-link').data(links);
          linkData.enter().append('path');
          update(linkData);
          linkData.exit().remove();
          return linkData;
        },
        updateLinks: function (links) {

          var linkData = renderScope.selectAll('.flow-link')
            .filter(function (d) {
              return _.contains(links, d);
            });

          update(linkData);
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
