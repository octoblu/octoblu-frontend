angular.module('octobluApp')
  .service('FlowNodeRenderer', function () {
    var nodeType = {
      width: 100,
      minHeight: 40,
      portHeight: 10,
      portWidth: 10
    };

    function getNodeHeight(node) {
      var nodeHeight = nodeType.minHeight;
      //height of the all the ports, without spaces
      var inputPortHeight = ((node.input) * nodeType.portHeight);
      //40

      var inputPortSpacing = ((node.input + 1) * nodeType.portHeight) / 2;
      //25
      inputPortHeight += inputPortSpacing;
      if (inputPortHeight > nodeHeight) {
        return inputPortHeight;
      }
      return nodeHeight;

    }

    return {
      render: function (renderScope, node) {
        var nodeHeight = getNodeHeight(node);
        var nodeElement = renderScope
          .append('g')
          .classed('flow-node', true)
          .classed('flow-node-' + node.type, true)
          .attr('transform', 'translate(' + node.x + ',' + node.y + ')');

        nodeElement
          .append('rect')
          .attr('width', nodeType.width)
          .attr('height', nodeHeight)
          .attr('rx', 6)
          .attr('ry', 6)
          .classed('flow-node-bg', true);

        nodeElement
          .append('text')
          .classed('flow-node-label', true)
          .attr('y', nodeHeight / 2)
          .attr('x', nodeType.width / 2)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'central')
          .text(node.name || node.type);

        var remainingSpace =
          nodeHeight - (node.input * nodeType.portHeight);

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
            .attr('y', (nodeHeight / 2) - 5)
            .attr('width', nodeType.portWidth)
            .attr('height', nodeType.portHeight)
            .classed('flow-node-port', true)
            .classed('flow-node-output-port', true);
        });

        return nodeElement;
      }
    };
  });
