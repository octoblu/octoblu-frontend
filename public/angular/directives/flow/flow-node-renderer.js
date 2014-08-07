angular.module('octobluApp')
  .constant('FlowNodeDimensions', {
    width: 100,
    minHeight: 40,
    portHeight: 10,
    portWidth: 10
  })
  .service('FlowNodeRenderer', function (FlowNodeDimensions, LinkRenderer) {

    function getNodeHeight(node) {
      var inputPorts = node.input || 0;
      var outputPorts = node.output || 0;
      var numPorts = inputPorts > outputPorts ? inputPorts : outputPorts;

      var nodeHeight = FlowNodeDimensions.minHeight;
      var totalPortHeight = ((numPorts) * FlowNodeDimensions.portHeight);
      var totalPortSpacing = ((numPorts + 1) * FlowNodeDimensions.portHeight) / 2;

      totalPortHeight += totalPortSpacing;

      if (totalPortHeight > nodeHeight) {
        return totalPortHeight;
      }

      return nodeHeight;
    }

    return {
      render: function (renderScope, node) {

        function renderPort(nodeElement, className, x, y) {
          var portElement = nodeElement
            .append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', FlowNodeDimensions.portWidth)
            .attr('height', FlowNodeDimensions.portHeight)
            .classed('flow-node-port', true)
            .classed(className, true);

          addDragBehavior(portElement);
        }

        function addDragBehavior(portElement) {
          var dragBehavior = d3.behavior.drag()
            .on('dragstart', function () {
              d3.event.sourceEvent.stopPropagation();
              d3.event.sourceEvent.preventDefault();
            })
            .on('drag', function (event) {
              d3.event.sourceEvent.stopPropagation();
              d3.event.sourceEvent.preventDefault();
              var from = {
                x: node.x + ( parseFloat(portElement.attr('x')) +
                  (FlowNodeDimensions.portHeight / 2)),
                y: node.y + ( parseFloat(portElement.attr('y')) +
                  (FlowNodeDimensions.portWidth / 2))
              };
              var to = {
                x: from.x + 15,
                y: from.y
              };
              LinkRenderer.render(renderScope, from, to);
            })
            .on('dragend', function () {
              d3.event.sourceEvent.stopPropagation();
              d3.event.sourceEvent.preventDefault();
            });

          portElement.call(dragBehavior);
        }

        var nodeHeight = getNodeHeight(node);
        node.inputLocations = [];
        node.outputLocations = [];

        var nodeElement = renderScope
          .append('g')
          .classed('flow-node', true)
          .classed('flow-node-' + node.class, true)
          .attr('transform', 'translate(' + node.x + ',' + node.y + ')');

        nodeElement
          .append('rect')
          .attr('width', FlowNodeDimensions.width)
          .attr('height', nodeHeight)
          .attr('rx', 6)
          .attr('ry', 6)
          .classed('flow-node-bg', true);

        nodeElement
          .append('text')
          .classed('flow-node-label', true)
          .attr('y', nodeHeight / 2)
          .attr('x', FlowNodeDimensions.width / 2)
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'central')
          .text(node.name || node.type);

        var remainingSpace =
          nodeHeight - (node.input * FlowNodeDimensions.portHeight);

        var spaceBetweenPorts = remainingSpace / (node.input + 1);
        var startPos = spaceBetweenPorts;
        node.inputLocations = [];
        node.outputLocations = [];

        _.times(node.input, function () {
          renderPort(nodeElement, 'flow-node-input-port', -(FlowNodeDimensions.portWidth / 2), startPos);
          node.inputLocations.push(startPos);
          startPos += spaceBetweenPorts + FlowNodeDimensions.portHeight;
        });

        var remainingSpace =
          nodeHeight - (node.output * FlowNodeDimensions.portHeight);

        var spaceBetweenPorts = remainingSpace / (node.output + 1);
        var startPos = spaceBetweenPorts;
        _.times(node.output, function () {
          renderPort(nodeElement, 'flow-node-output-port', FlowNodeDimensions.width - (FlowNodeDimensions.portWidth / 2), startPos);
          node.outputLocations.push(startPos);
          startPos += spaceBetweenPorts + FlowNodeDimensions.portHeight;
        });

        return nodeElement;
      }
    };
  });
