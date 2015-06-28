angular.module('octobluApp')
  .constant('FlowNodeDimensions', {
    width: 80,
    minHeight: 70,
    portHeight: 15,
    portWidth: 15
  })
  .service('FlowNodeRenderer', function (FlowNodeDimensions, deviceService, LinkRenderer, IconCodes, OCTOBLU_ICON_URL) {

    var SOCKET_URL = OCTOBLU_ICON_URL + "socket.svg";

    function getNodeHeight(node) {
      return FlowNodeDimensions.minHeight;
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
      return {id: node.id, port: 0};
    };

    var findOutputPortByCoordinate = function(xCoordinate, yCoordinate, nodes){
      var node = findNodeByCoordinates(xCoordinate, yCoordinate, nodes);

      if(!node){
        return;
      }
      if(xCoordinate < inputPortLeftSideX(node)){
        return;
      }
      return {id: node.id, port: 0};
    };
/*
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
*/
    function renderIsOnline(node, nodeElement) {
      deviceService.getDeviceByUUID(node.uuid)
        .then(function(device){
          if(!device){
            return;
          }
          nodeElement.toggleClass('faded', !device.online);
        });
    }

    return {

      render: function (snap, renderScope, node, flow) {

        function renderPort(nodeElement, className, x, y, index, sourcePortType) {
          var portElement = nodeElement
            .append(
              snap.rect(x,y,FlowNodeDimensions.portWidth,FlowNodeDimensions.portHeight)
              .attr({'data-port-number': index})
              .toggleClass('flow-node-port', true)
              .toggleClass(className, true));

          //addDragBehavior(portElement, index, sourcePortType);
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
              var x, y, point, rectangle, portRect, clientX, clientY;

              if (d3.event.sourceEvent.changedTouches) {
                clientX = d3.event.sourceEvent.changedTouches[0].clientX;
                clientY = d3.event.sourceEvent.changedTouches[0].clientY;
              } else {
                clientX = d3.event.sourceEvent.clientX;
                clientY = d3.event.sourceEvent.clientY;
              }

              x = clientX / flow.zoomScale;
              x = x - (flow.zoomX / flow.zoomScale);
              y = clientY / flow.zoomScale;
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
          if (data && data.logo) {
            return data.logo;
          }
          if (data && data.type) {
            return OCTOBLU_ICON_URL + data.type.replace(':', '/') + '.svg';
          }
        };

        var nodeElement = snap.group()
          .toggleClass('flow-node', true)
          .toggleClass('flow-node-' + node.class, true)
          .toggleClass('selected', (node === flow.selectedFlowNode))
          .attr({'id': 'node-' + node.id})
          .attr({'transform': 'translate(' + node.x + ',' + node.y + ')'});

        nodeElement.append(
          snap.rect(0,0,FlowNodeDimensions.width,nodeHeight,6,6));

        nodeElement.append(
          snap.image(logoUrl(node),0,0,FlowNodeDimensions.width,nodeHeight));

        renderIsOnline(node, nodeElement);

        if(node.needsConfiguration){
          nodeElement.append(
            snap.image(SOCKET_URL,0,0,FlowNodeDimensions.width,nodeHeight));
        }

        if (node.errorMessage) {
          nodeElement.toggleClass('error', true);
        }

        if (node.type === 'operation:trigger') {
          var buttonElement = snap.select('#node-button-' + node.id);
          if (!buttonElement) {
            buttonElement = snap
              .append(snap.rect(0,0,30,30,2,2)
                .attr({'id':'node-button-' + node.id})
                .toggleClass('flow-node-button', true));
          }
          buttonElement
            .attr({'x': node.x - (FlowNodeDimensions.width / 2) + 5})
            .attr({'y': node.y + (FlowNodeDimensions.minHeight / 2) - 15});
        }

        var label = node.name || node.class || '';
        var lines = label.split("\n");

        _.each(lines, function(line, i){
          nodeElement
            .append(snap.text(0,0,line)
            .toggleClass('flow-node-label', true)
            .attr({'y': nodeHeight + 10 + (i * 15)})
            .attr({'x': FlowNodeDimensions.width / 2})
            .attr({'text-anchor': 'middle'})
            .attr({'alignment-baseline': 'central'}));
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
