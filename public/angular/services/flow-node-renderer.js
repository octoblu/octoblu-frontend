angular.module('octobluApp')
  .constant('FlowNodeDimensions', {
    width: 80,
    minHeight: 70,
    portHeight: 10,
    portWidth: 10
  })
  .service('FlowNodeRenderer', function (FlowNodeDimensions, LinkRenderer, IconCodes) {

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
          flowNode.x - (FlowNodeDimensions.portWidth / 2),
          flowNode.y,
          flowNode.x + FlowNodeDimensions.width + (FlowNodeDimensions.portWidth / 2),
          flowNode.y + FlowNodeDimensions.minHeight
        ];
        if(pointInsideRectangle(point, rectangle)){
          return flowNode;
        }
      });

      return _.first(foundNodes);
    };

    var inputPortLeftSideX = function(node) {
      return node.x + FlowNodeDimensions.width - FlowNodeDimensions.portWidth;
    };

    var inputPortRightSideX = function(node) {
      return node.x + FlowNodeDimensions.portWidth;
    };

    var findInputPortByCoordinate = function(xCoordinate, yCoordinate, nodes){
      var node = findNodeByCoordinates(xCoordinate, yCoordinate, nodes);

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

      if (port == -1) {
        return;
      }

      return {id: node.id, port: port};
    };

    var findOutputPortByCoordinate = function(xCoordinate, yCoordinate, nodes){
      var node = findNodeByCoordinates(xCoordinate, yCoordinate, nodes);
      if(!node){
        return;
      }

      if(xCoordinate < inputPortLeftSideX(node)){
        return;
      }

      var port = _.findIndex(node.outputLocations, function(outputLocation){
        var offsetOutputLocation = outputLocation + node.y;
        return offsetOutputLocation <= yCoordinate && yCoordinate <= (offsetOutputLocation + FlowNodeDimensions.portHeight);
      });

      if (port == -1) {
        return;
      }

      return {id: node.id, port: port};
    };

    function wrapLines(text) {
      var text = d3.select(this),
          lines = text.text().split(/\n+/),
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

      _.each(lines, function(line){
        text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(line);
      });
    };

    return {
      render: function (renderScope, node, flow) {

        function renderPort(nodeElement, className, x, y, index, sourcePortType) {
          var portElement = nodeElement
            .append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', FlowNodeDimensions.portWidth)
            .attr('height', FlowNodeDimensions.portHeight)
            .attr('data-port-number', index)
            .classed('flow-node-port', true)
            .classed(className, true);

          addDragBehavior(portElement, index, sourcePortType);
        }

        function addDragBehavior(portElement, sourcePortNumber, sourcePortType) {
          var dragBehavior = d3.behavior.drag()
            .on('dragstart', function () {
              if(!d3.event){return};
              d3.event.sourceEvent.stopPropagation();
              d3.event.sourceEvent.preventDefault();
            })
            .on('drag', function () {
              d3.event.sourceEvent.stopPropagation();
              d3.event.sourceEvent.preventDefault();
              renderScope.selectAll('.flow-potential-link').remove();
              var from = {
                x: node.x + ( parseFloat(portElement.attr('x')) +
                  (portElement.attr('height') / 2)),
                y: node.y + ( parseFloat(portElement.attr('y')) +
                  (portElement.attr('width') / 2))
              };
              var to = {
                x: (node.x + d3.event.x),
                y: (node.y + d3.event.y)
              };

              LinkRenderer.render(renderScope, from, to);
            })
            .on('dragend', function () {
              var x, y, point, rectangle, portRect;

              x = d3.event.sourceEvent.offsetX / flow.zoomScale;
              x = x - (flow.zoomX / flow.zoomScale);
              y = d3.event.sourceEvent.offsetY / flow.zoomScale;
              y = y - (flow.zoomY / flow.zoomScale);

              if (sourcePortType == 'output') {
                var inputPort = findInputPortByCoordinate(x, y, flow.nodes);
                if(inputPort){
                  if (node.id != inputPort.id) {
                    flow.links.push({from: node.id, fromPort: sourcePortNumber, to: inputPort.id, toPort: inputPort.port});
                    return;
                  }
                }
              }

              if (sourcePortType == 'input') {
                var outputPort = findOutputPortByCoordinate(x, y, flow.nodes);
                if(outputPort){
                  if (node.id != outputPort.id) {
                    flow.links.push({from: outputPort.id, fromPort: outputPort.port, to: node.id, toPort: sourcePortNumber});
                    return;
                  }
                }
              }

              renderScope.selectAll('.flow-potential-link').remove();
            });

          portElement.call(dragBehavior);
        }

        var nodeHeight = getNodeHeight(node);
        node.inputLocations = [];
        node.outputLocations = [];

        if (!node.x) {
          var width = ($(window).width()/flow.zoomScale)/2;
          var height = ($(window).height()/flow.zoomScale)/2;
          var zoomX = flow.zoomX / flow.zoomScale;
          var zoomY = flow.zoomY / flow.zoomScale;


          node.x = width - zoomX;
          node.y = height - zoomY;
        }

        var logoUrl = function(data) {
          if (data && data.type) {
            return 'https://s3-us-west-2.amazonaws.com/octoblu-icons/' + data.type.replace(':', '/') + '.svg';
          }
        }


        var nodeElement = renderScope
          .append('g')
          .classed('flow-node', true)
          .classed('flow-node-' + node.class, true)
          .classed('selected', (node === flow.selectedFlowNode))
          .attr('id', 'node-' + node.id)
          .attr('transform', 'translate(' + node.x + ',' + node.y + ')');

        nodeElement
          .append('rect')
          .attr('width', FlowNodeDimensions.width)
          .attr('height', nodeHeight)
          .attr('rx', 6)
          .attr('ry', 6);

        nodeElement
          .append("svg:image")
          .attr('width', FlowNodeDimensions.width)
          .attr('height', nodeHeight)
          .attr("xlink:href",logoUrl(node));

        if (node.type === 'operation:trigger') {
          nodeElement
            .append('rect')
            .attr('width', 20)
            .attr('height', 20)
            .attr('rx', 2)
            .attr('ry', 2)
            .attr('x', -15)
            .attr('y', (nodeHeight / 2) - 10)
            .classed('flow-node-button', true);
        }

        var label = node.name || node.class || '';
        var lines = label.split("\n");
        _.each(lines, function(line, i){
          nodeElement
            .append('text')
            .classed('flow-node-label', true)
            .attr('y', nodeHeight + 10 + (i * 15))
            .attr('x', FlowNodeDimensions.width / 2)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'central')
            .text(line);
        });

        var remainingSpace =
          nodeHeight - (node.input * FlowNodeDimensions.portHeight);

        var spaceBetweenPorts = remainingSpace / (node.input + 1) ;
        var startPos = spaceBetweenPorts;
        node.inputLocations = [];
        node.outputLocations = [];

        _.times(node.input, function (index) {
          renderPort(nodeElement, 'flow-node-input-port', -(FlowNodeDimensions.portWidth / 2), startPos, index, 'input');
          node.inputLocations.push(startPos);
          startPos += spaceBetweenPorts + FlowNodeDimensions.portHeight;
        });

        var remainingSpace =
          nodeHeight - (node.output * FlowNodeDimensions.portHeight);

        var spaceBetweenPorts = remainingSpace / (node.output + 1);
        var startPos = spaceBetweenPorts;
        _.times(node.output, function (index) {
          renderPort(nodeElement, 'flow-node-output-port', FlowNodeDimensions.width - (FlowNodeDimensions.portWidth / 2), startPos, index, 'output');
          node.outputLocations.push(startPos);
          startPos += spaceBetweenPorts + FlowNodeDimensions.portHeight;
        });

        return nodeElement;
      },
      findInputPortByCoordinate: findInputPortByCoordinate,
      findOutputPortByCoordinate : findOutputPortByCoordinate,
      pointInsideRectangle: pointInsideRectangle
    };
  });
