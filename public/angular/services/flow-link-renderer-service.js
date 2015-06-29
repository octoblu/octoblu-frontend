angular.module('octobluApp')
  .service('FlowLinkRenderer', function (FlowNodeDimensions) {
    var _this = this;

    function getNodePortLocation(portStr, locations) {
      if (!portStr) {
        portStr = 0;
      }
      if (!locations) {
        return 0;
      }
      return locations[parseInt(portStr)] || 0;
    }

    function linkPath(link, flowNodes) {
      var sourceNode = _.findWhere(flowNodes, {id: link.from}),
        targetNode   = _.findWhere(flowNodes, {id: link.to});

      if (!sourceNode || !targetNode) {
        return;
      }

      var sourcePortLocation = getNodePortLocation(link.fromPort, sourceNode.outputLocations);

      var from = {
        x: sourceNode.x + FlowNodeDimensions.width,
        y: sourceNode.y + sourcePortLocation + (FlowNodeDimensions.portHeight / 2)
      };

      var fromCurve = {
        x: from.x + FlowNodeDimensions.minHeight,
        y: from.y
      };

      var targetPortLocation = getNodePortLocation(link.toPort, targetNode.inputLocations);
      var to = {
        x: targetNode.x,
        y: targetNode.y + targetPortLocation + (FlowNodeDimensions.portHeight / 2)
      };

      var toCurve = {
        x: to.x - FlowNodeDimensions.minHeight,
        y: to.y
      };
      return "M"+from.x+" "+from.y+
        " C "+fromCurve.x+" "+fromCurve.y +", "+
          toCurve.x+" "+toCurve.y+", "+
          to.x+" "+to.y;
    };

    _this.render = function (snap, link, flow) {
      var path = linkPath(link, flow.nodes)
      if (!path){
        return;
      }
      var link = snap.path(path)
              .toggleClass('flow-link', true)
              .toggleClass('selected', (link === flow.selectedLink));

      snap.select(".flow-editor-render-area").append(link);
      return link;
    };

    return _this;
  });
