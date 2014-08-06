angular.module('octobluApp')
  .service('FlowNodeRenderer', function () {
    var nodeType = {
      width: 100,
      height: 40,
      portHeight: 10,
      portWidth: 10
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

        var remainingSpace =
          nodeType.height - (node.input * nodeType.portHeight);

        var spaceBetweenPorts = remainingSpace / (node.input + 1);
        var startPos = spaceBetweenPorts;
        _.times(node.input, function () {

          nodeElement
            .append('rect')
            .attr('x', -(nodeType.portWidth / 2))
            .attr('y', startPos)
            .attr('width', nodeType.portWidth)
            .attr('height', nodeType.portHeight)
            .classed('flow-node-port', true)
            .classed('flow-node-input-port', true);

          startPos += spaceBetweenPorts + nodeType.portHeight;

        });

        _.times(node.output, function () {
          console.log('output', node.output);
          nodeElement
            .append('rect')
            .attr('x', nodeType.width - (nodeType.portWidth / 2))
            .attr('y', (nodeType.height / 2) - 5)
            .attr('width', nodeType.portWidth)
            .attr('height', nodeType.portHeight)
            .classed('flow-node-port', true)
            .classed('flow-node-output-port', true);
        });

        return nodeElement;
      }
    };
  });
