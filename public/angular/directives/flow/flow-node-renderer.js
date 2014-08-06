angular.module('octobluApp')
  .service('FlowNodeRenderer', function () {
    var nodeType = {
      width: 100,
      height: 35
    };
    return {
      render: function (renderScope, node) {
        console.log(node);
        var nodeElement = renderScope
          .append('g')
          .classed('flow-node', true)
          .classed('flow-node-' + node.type, true)
          .attr('transform', 'translate(' + node.x + ',' + node.y + ')');

        nodeElement
          .append('rect')
          .attr('width', nodeType.width)
          .attr('height', nodeType.height)
          .attr('rx', 6)
          .attr('ry', 6)
          .classed('flow-node-bg', true);

        nodeElement
          .append('text')
          .classed('flow-node-label', true)
          .attr('y', nodeType.height / 2)
          .attr('x', nodeType.width / 2)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'central')
          .text(node.name || node.type);

        _.times(node.input, function () {
          nodeElement
            .append('rect')
            .attr('x', -5)
            .attr('y', 12)
            .attr('width', 10)
            .attr('height', 10)
            .classed('flow-node-port', true)
            .classed('flow-node-input-port', true);
        });

        _.times(node.output, function () {
          console.log('output', node.output);
          nodeElement
            .append('rect')
            .attr('x', 95)
            .attr('y', 12)
            .attr('width', 10)
            .attr('height', 10)
            .classed('flow-node-port', true)
            .classed('flow-node-output-port', true);
        });

        return nodeElement;
      }
    };
  });
