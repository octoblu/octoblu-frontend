angular.module('octobluApp')
  .service('FlowLinkRenderer', function (FlowNodeDimensions) {

    function getNodePortLocation(portStr, locations) {
      if (!portStr) {
        portStr = 0;
      }
      if (!locations) {
        return 0;
      }
      return locations[parseInt(portStr)] || 0;
    }

    function linkPath(link, flowNodes, loc) {
      var sourceNode = _.findWhere(flowNodes, {id: link.from}),
        targetNode   = _.findWhere(flowNodes, {id: link.to});

      if (!sourceNode || !targetNode) {
        return;
      }

      var sourcePortLocation = getNodePortLocation(link.fromPort, sourceNode.outputLocations);
      var from = {
        x: ((loc && loc.from && loc.from.x) || sourceNode.x) + FlowNodeDimensions.width,
        y: ((loc && loc.from && loc.from.y) || sourceNode.y) +
            sourcePortLocation + (FlowNodeDimensions.portHeight / 2)
      };
      var fromCurve = {
        x: from.x + FlowNodeDimensions.minHeight,
        y: from.y
      };

      var targetPortLocation = getNodePortLocation(link.toPort, targetNode.inputLocations);
      var to = {
        x: ((loc && loc.to && loc.to.x) || targetNode.x),
        y: ((loc && loc.to && loc.to.y) || targetNode.y) +
            targetPortLocation + (FlowNodeDimensions.portHeight / 2)
      };
      var toCurve = {
        x: to.x - FlowNodeDimensions.minHeight,
        y: to.y
      };

      return "M"+from.x+" "+from.y+
             "C"+fromCurve.x+" "+fromCurve.y +","+
              toCurve.x+" "+toCurve.y+","+
              to.x+" "+to.y;
    }

    return {
      render: function (snap, link, flow, loc) {
        var path = linkPath(link, flow.nodes, loc)
        if (!path){
          return;
        }
        //console.log('renderLink:',link);
        var link = snap.path(path)
                .toggleClass('flow-link', true)
                .toggleClass('flow-link-to-'+link.to,true)
                .toggleClass('flow-link-from-'+link.from,true)
                .toggleClass('selected', (link === flow.selectedLink));

        snap.select(".flow-link-area").append(link);
        return link;
      }
    }
  });
