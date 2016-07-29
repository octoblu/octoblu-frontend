angular.module('octobluApp')
  .constant('FlowNodeDimensions', {
    width: 80,
    minHeight: 70,
    portHeight: 15,
    portWidth: 15
  })
  .service('FlowNodeRenderer', function (FlowNodeDimensions, deviceService, IconCodes, OCTOBLU_ICON_URL, DeviceLogo) {

    var SOCKET_URL = OCTOBLU_ICON_URL + "socket.svg";
    var CONFIGURE_LOGO_URL = OCTOBLU_ICON_URL + "experimental/configure-device.svg"
    function getNodeHeight(node) {
      return FlowNodeDimensions.minHeight;
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
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

      render: function (snap, node, nodeElement, renderGroup) {

        function renderPort(nodeElement, node, className, x, y) {
          var portElement =
            snap.rect(x,y,FlowNodeDimensions.portWidth,FlowNodeDimensions.portHeight)
              .toggleClass('flow-node-port', true)
              .toggleClass(className, true);
          nodeElement.append(portElement);
        }

        function renderIsOnline(node, nodeElement) {
          var online = node.online;
          if (_.isUndefined(online)) {
            online = true;
          }
          nodeElement.toggleClass('faded', !online);
        }

        var nodeHeight = getNodeHeight(node);

        if (!_.isNumber(node.x) || !_.isNumber(node.y)) {
          var vbox = snap.attr('viewBox');
          node.x = getRandomInt(vbox.x, vbox.x+vbox.w-FlowNodeDimensions.width);
          node.y = getRandomInt(vbox.y, vbox.y+vbox.h-FlowNodeDimensions.minHeight);
        }

        var logoUrl = function(data) {
          return new DeviceLogo(data).get();
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
          .attr({'id': 'node-' + node.id})
          .attr({'transform': 'translate(' + node.x + ',' + node.y + ')'});

        nodeElement.append(
          snap.rect(0,0,FlowNodeDimensions.width,nodeHeight,6,6));

        if(node.eventType === 'configure') {
          nodeElement.append(snap.image(CONFIGURE_LOGO_URL,FlowNodeDimensions.width-20,-20,20,20)
              .attr({'preserveAspectRatio':'xMidYMax'}))
          renderIsOnline(node, nodeElement);
        }

        var logo = logoUrl(node);
        if (logo) {
          nodeElement.append(
            snap.image(logo,0,0,FlowNodeDimensions.width,nodeHeight)
              .attr({'preserveAspectRatio':'xMidYMax'}));
        }

        if(node.needsConfiguration){
          nodeElement.append(
            snap.image(SOCKET_URL,0,0,FlowNodeDimensions.width,nodeHeight)
              .attr({'preserveAspectRatio':'xMidYMax'}));
        }

        if (node.errorMessage) {
          nodeElement.toggleClass('error', true);
        }

        if (node.type === 'operation:trigger') {
          nodeElement.append(
            snap.polygon([-20,45, 0,35, -20,25])
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
