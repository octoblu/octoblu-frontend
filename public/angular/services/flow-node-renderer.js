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

      render: function (snap, node, flow) {

        function renderPort(nodeElement, className, x, y, index, sourcePortType) {
          var portElement =
            snap.rect(x,y,FlowNodeDimensions.portWidth,FlowNodeDimensions.portHeight)
              .attr({'data-port-number': index})
              .toggleClass('flow-node-port', true)
              .toggleClass(className, true);
          nodeElement.append(portElement);
          addDragBehavior(portElement, index, sourcePortType);
        }

        function addDragBehavior(portElement, sourcePortNumber, sourcePortType) {
          var bbox = portElement.getBBox();

          portElement.drag(
            function (dx,dy,ex,ey,event) {
              //console.log("port onMove", arguments);
              if(!event){return};
              event.stopPropagation();
              event.preventDefault();
              snap.selectAll('.flow-potential-link').remove();

              var from = {
                x: node.x + bbox.x + bbox.w/2,
                y: node.y + bbox.y + bbox.h/2,
              };
              var to = snap.transformCoords(ex,ey);

              if (sourcePortType == 'output') {
                LinkRenderer.render(snap, from, to);
              } else {
                LinkRenderer.render(snap, to, to);
              }
            },
            function (x,y,event) {
              //console.log("port onDragStart:", arguments);
              if(!event){return};
              event.stopPropagation();
              event.preventDefault();
            },
            function (event) {
              //console.log("port onDragEnd", arguments);
              if(!event){return};
              var x, y, point, rectangle, portRect, clientX, clientY;

              if (event.changedTouches) {
                clientX = event.changedTouches[0].clientX;
                clientY = event.changedTouches[0].clientY;
              } else {
                clientX = event.clientX;
                clientY = event.clientY;
              }

              var target = snap.transformCoords(clientX,clientY);
              var newLink = undefined;

              if (sourcePortType == 'output') {
                var inputPort = findInputPortByCoordinate(target.x, target.y, flow.nodes);
                if(inputPort && node.id != inputPort.id) {
                  newLink = {from: node.id, fromPort: sourcePortNumber, to: inputPort.id, toPort: inputPort.port};
                }
              }

              if (sourcePortType == 'input') {
                var outputPort = findOutputPortByCoordinate(target.x, target.y, flow.nodes);
                if(outputPort && node.id != outputPort.id) {
                  newLink = {from: outputPort.id, fromPort: outputPort.port, to: node.id, toPort: sourcePortNumber};
                }
              }

              // Check if our link already exists, if not add
              // and return earlier to avoid removing potential link
              if (newLink && !_.find(flow.links,newLink)) {
                flow.links.push(newLink);
                console.log("newLink:",newLink);
                return;
              }

              snap.selectAll('.flow-potential-link').remove();
            });
        }

        var nodeHeight = getNodeHeight(node);
        node.inputLocations = [];
        node.outputLocations = [];

        if (!node.x || isNaN(node.x) ||
            !node.y || isNaN(node.y)) {
          console.log("initializing node location!");
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

        snap.select("g").append(nodeElement);

        nodeElement.append(
          snap.rect(0,0,FlowNodeDimensions.width,nodeHeight,6,6));

        nodeElement.append(
          snap.image(logoUrl(node),0,0,FlowNodeDimensions.width,nodeHeight)
            .attr({'preserveAspectRatio':'xMaxYMax'}));

        renderIsOnline(node, nodeElement);

        if(node.needsConfiguration){
          nodeElement.append(
            snap.image(SOCKET_URL,0,0,FlowNodeDimensions.width,nodeHeight));
        }

        if (node.errorMessage) {
          nodeElement.toggleClass('error', true);
        }

        if (node.type === 'operation:trigger') {
          nodeElement.append(
            snap.rect(-30,(FlowNodeDimensions.minHeight/2)-15,30,30,2,2)
              .attr({'id':'node-button-' + node.id})
              .toggleClass('flow-node-button', true));
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
