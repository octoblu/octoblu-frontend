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

      render: function (snap, node, context, nodeElement, renderGroup) {

        function renderPort(nodeElement, node, className, x, y, index, sourcePortType) {
          var portElement =
            snap.rect(x,y,FlowNodeDimensions.portWidth,FlowNodeDimensions.portHeight)
              .attr({'data-port-number': index})
              .toggleClass('flow-node-port', true)
              .toggleClass(className, true);
          nodeElement.append(portElement);
          addDragBehavior(node, portElement, index, sourcePortType);
        }

        function addDragBehavior(node, portElement, sourcePortNumber, sourcePortType) {
          var bbox = portElement.getBBox();
          var linkElement;

          portElement.drag(
            function (dx,dy,ex,ey,event) {
              //console.log("port onMove", arguments);
              if(!event){return};
              event.stopPropagation();
              event.preventDefault();
              //snap.selectAll('.flow-potential-link').remove();
              var to = snap.transformCoords(ex,ey);
              if (sourcePortType == 'output') {
                linkElement = LinkRenderer.render(snap, null, to, {from:node.id}, [node], linkElement);
              } else {
                linkElement = LinkRenderer.render(snap, to, null, {to:node.id}, [node], linkElement);
              }
            },
            function (x,y,event) {
              //console.log("port onDragStart:", arguments);
              if(!event){return};
              event.stopPropagation();
              event.preventDefault();
              linkElement = undefined;
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
                var inputPort = findInputPortByCoordinate(target.x, target.y, context.flow.nodes);
                if(inputPort && node.id != inputPort.id) {
                  newLink = {from: node.id, fromPort: sourcePortNumber, to: inputPort.id, toPort: inputPort.port};
                }
              }

              if (sourcePortType == 'input') {
                var outputPort = findOutputPortByCoordinate(target.x, target.y, context.flow.nodes);
                if(outputPort && node.id != outputPort.id) {
                  newLink = {from: outputPort.id, fromPort: outputPort.port, to: node.id, toPort: sourcePortNumber};
                }
              }

              // Check if our link already exists, if not add
              // and return earlier to avoid removing potential link
              if (newLink && !_.find(context.flow.links,newLink)) {
                context.flow.links.push(newLink);
                linkElement = LinkRenderer.render(snap, null, null, newLink, context.flow.nodes, linkElement);
                console.log("newLink:",newLink);
                return;
              }

              snap.selectAll('.flow-potential-link').remove();
            });
        }

        var nodeHeight = getNodeHeight(node);
        node.inputLocations = [];
        node.outputLocations = [];

        if (node.x === undefined || node.x === null || isNaN(node.x) ||
            node.y === undefined || node.y === null || isNaN(node.y)) {
          console.log("initializing node location!");
          var width = ($(window).width()/context.flow.zoomScale)/2;
          var height = ($(window).height()/context.flow.zoomScale)/2;
          var zoomX = context.flow.zoomX / context.flow.zoomScale;
          var zoomY = context.flow.zoomY / context.flow.zoomScale;

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

        var newRender = false;

        if (!nodeElement) {
          newRender = true;
          nodeElement = snap.group();
          renderGroup = renderGroup || snap.select(".flow-render-area");
          renderGroup.append(nodeElement);
        } else {
          nodeElement.selectAll("*").remove();
        }

        nodeElement
          .addClass('flow-node')
          .addClass('flow-node-' + node.class)
          .toggleClass('selected', (node === context.flow.selectedFlowNode))
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
          nodeElement.append(
            snap.rect(-35,(FlowNodeDimensions.minHeight/2)-15,30,30,2,2)
              .attr({'id':'node-button-' + node.id})
              .toggleClass('flow-node-button', true));
        }

        var label = node.name || node.class || '';
        var lines = label.split("\n");

        _.each(lines, function(line, i){
          nodeElement
            .append(snap.text(0,0,line)
            .addClass('flow-node-label')
            .attr({'y': nodeHeight + 10 + (i * 15)})
            .attr({'x': FlowNodeDimensions.width / 2})
            .attr({'text-anchor': 'middle'})
            .attr({'alignment-baseline': 'central'}));
        });

        if (node.input>0) {
          var startY = (nodeHeight - FlowNodeDimensions.portHeight)/2;
          var startX = -(FlowNodeDimensions.portWidth / 2);
          renderPort(nodeElement, node, 'flow-node-input-port', startX, startY, 0, 'input');
        }

        if (node.output>0){
          var startY = (nodeHeight - FlowNodeDimensions.portHeight)/2;
          var startX = FlowNodeDimensions.width - (FlowNodeDimensions.portWidth / 2);
          renderPort(nodeElement, node, 'flow-node-output-port', startX, startY, 0, 'output');
        }

        return nodeElement;
      },
      findInputPortByCoordinate: findInputPortByCoordinate,
      findOutputPortByCoordinate : findOutputPortByCoordinate,
      pointInsideRectangle: pointInsideRectangle
    };
  }
);
