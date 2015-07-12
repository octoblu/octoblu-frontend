angular.module('octobluApp')
  .constant('FlowNodeDimensions', {
    width: 80,
    minHeight: 70,
    portHeight: 15,
    portWidth: 15
  })
  .service('FlowNodeRenderer', function (FlowNodeDimensions, deviceService, CoordinatesService, IconCodes, OCTOBLU_ICON_URL) {

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

    return {

      render: function (snap, node, context, nodeElement, renderGroup) {

        function renderPort(nodeElement, node, className, x, y) {
          var portElement =
            snap.rect(x,y,FlowNodeDimensions.portWidth,FlowNodeDimensions.portHeight)
              .toggleClass('flow-node-port', true)
              .toggleClass(className, true);
          nodeElement.append(portElement);
        }

        function renderIsOnline(node, nodeElement) {
          deviceService.getDeviceByUUID(node.uuid)
            .then(function(device){
              if(!device){
                return;
              }
              nodeElement.toggleClass('faded', !device.online);
            });
        }

        var nodeHeight = getNodeHeight(node);
        node.inputLocations = [];
        node.outputLocations = [];

        if (!_.isNumber(node.x) || !_.isNumber(node.y)) {
          var vbox = snap.attr('viewBox');
          node.x = vbox.x + vbox.w/2;
          node.y = vbox.y + vbox.h/2;
        }

        var logoUrl = function(data) {
          if (data && data.logo) {
            return data.logo;
          }
          if (data && data.type) {
            return OCTOBLU_ICON_URL + data.type.replace(':', '/') + '.svg';
          }
        };

        if (!nodeElement) {
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
          snap.image(logoUrl(node),0,0,FlowNodeDimensions.width,nodeHeight)
            .attr({'preserveAspectRatio':'xMaxYMax'}));

        renderIsOnline(node, nodeElement);

        if(node.needsConfiguration){
          nodeElement.append(
            snap.image(SOCKET_URL,0,0,FlowNodeDimensions.width,nodeHeight)
              .attr({'preserveAspectRatio':'xMaxYMax'}));
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
          renderPort(nodeElement, node, 'flow-node-input-port', startX, startY);
        }

        if (node.output>0){
          var startY = (nodeHeight - FlowNodeDimensions.portHeight)/2;
          var startX = FlowNodeDimensions.width - (FlowNodeDimensions.portWidth / 2);
          renderPort(nodeElement, node, 'flow-node-output-port', startX, startY);
        }

        return nodeElement;
      },
      findNodeByCoordinates: findNodeByCoordinates
    };
  }
);
