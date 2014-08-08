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

    var pointInsideRectangle = function(point, rectangle){
      var leftMatch, rightMatch, topMatch, bottomMatch;
      leftMatch   = point[0] > rectangle[0];
      rightMatch  = point[0] < rectangle[2];
      topMatch    = point[1] > rectangle[1];
      bottomMatch = point[1] < rectangle[3];
      return leftMatch && rightMatch && topMatch && bottomMatch;
    };

    var findNodeByCoordinates = function(xCoordinate, yCoordinate, nodes){
      var point, rectangle, foundNodes, foundNode;
      point = [xCoordinate, yCoordinate];

      foundNodes = _.filter(nodes, function(flowNode) {
        rectangle = [
          flowNode.x,
          flowNode.y,
          flowNode.x + FlowNodeDimensions.width,
          flowNode.y + FlowNodeDimensions.minHeight
        ];
        if(pointInsideRectangle(point, rectangle)){
          return flowNode;
        };
      });

      return _.first(foundNodes);
    };

    var inputPortRightSideX = function(node) {
      return FlowNodeDimensions.portWidth + node.x;
    }

    var findPortByCoordinate = function(xCoordinate, yCoordinate, nodes){
      var node, rightInputPortWall, port;

      node = findNodeByCoordinates(xCoordinate, yCoordinate, nodes);
      if(!node){
        return;
      }

      if(inputPortRightSideX(node) < xCoordinate){
        return;
      }

      var port = _.findIndex(node.inputLocations, function(inputLocation){
        var offsetInputLocation = inputLocation + node.y;
        return offsetInputLocation <= yCoordinate && yCoordinate <= (offsetInputLocation + FlowNodeDimensions.portHeight);
      });

      return {id: '1', port: port, type: 'input'};
    };

    return {
      render: function (renderScope, node, flow) {

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
                x: (node.x + d3.event.x),
                y: (node.y + d3.event.y)
              };

              renderScope.selectAll('.flow-link').remove();
              LinkRenderer.render(renderScope, from, to);
            })
            .on('dragend', function () {
              var x, y, point, rectangle, portRect;

              x = d3.event.sourceEvent.offsetX;
              y = d3.event.sourceEvent.offsetY;

              targetNode =

              _.each(flow.nodes, function(flowNode) {
                point = [x,y];
                var grace = (FlowNodeDimensions.portWidth / 2);
                rectangle = [
                  flowNode.x,
                  flowNode.y,
                  flowNode.x + FlowNodeDimensions.width,
                  flowNode.y + FlowNodeDimensions.minHeight
                ];

                _.each(flowNode.inputLocations || [], function(loc, index) {
                  portRect = [
                    rectangle[0] - grace,
                    rectangle[1] + parseInt(loc),
                    rectangle[0] + grace,
                    rectangle[1] + loc + FlowNodeDimensions.portHeight
                  ];
                  if(pointInsideRectangle(point, portRect)) {
                    console.log(loc);
                    var link = {from: node.id, fromPort: 0, to: flowNode.id, toPort: index};
                    flow.links.push(link);
                  }
                });

                _.each(flowNode.outputLocations || [], function(loc, index) {
                  portRect = [
                    rectangle[2] - grace,
                    rectangle[1] + loc,
                    rectangle[2] + grace,
                    rectangle[1] + loc + FlowNodeDimensions.portHeight
                  ];
                  if(pointInsideRectangle(point, portRect)) {
                    var link = {from: flowNode.id, fromPort: index, to: node.id, toPort: 0};
                    flow.links.push(link);
                  }
                });

              });
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
      },
      findPortByCoordinate: findPortByCoordinate,
      pointInsideRectangle: pointInsideRectangle
    };
  });
