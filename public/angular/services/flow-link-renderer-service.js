angular.module('octobluApp')
  .service('FlowLinkRenderer', function (FlowNodeDimensions) {

    function getNodePortLocation(portStr, locations) {
      if (!portStr) { portStr = 0; }
      if (!locations) { return 0; }
      return locations[parseInt(portStr)] || 0;
    }

    function linkPath(link, flowNodes, loc) {
      var sourceNode, targetNode;
      var from, fromCurve, toCurve, to;

      if (link && link.from) {
        sourceNode = _.findWhere(flowNodes, {id: link.from});
      }
      if (link && link.to) {
        targetNode = _.findWhere(flowNodes, {id: link.to});
      }
      if (!link) {
        link = {};
      }

      if (loc && loc.from) {
        from = _.clone(loc.from);
      } else {
        if (!sourceNode) { return; }
        from = _.clone(sourceNode);
      }
      if (loc && loc.to) {
        to = _.clone(loc.to);
      } else {
        if (!targetNode) { return; }
        to = _.clone(targetNode);
      }

      if (!sourceNode) {
        sourceNode = {};
      }
      if (!targetNode) {
        targetNode = {};
      }

      if (!from.noPort) {
        var sourcePortLocation = getNodePortLocation(link.fromPort, sourceNode.outputLocations);
        from.x += FlowNodeDimensions.width;
        from.y += sourcePortLocation + (FlowNodeDimensions.portHeight / 2);
      }
      var fromCurve = {
        x: from.x + FlowNodeDimensions.minHeight,
        y: from.y
      };

      if (!to.noPort) {
        var targetPortLocation = getNodePortLocation(link.toPort, targetNode.inputLocations);
        to.y += targetPortLocation + (FlowNodeDimensions.portHeight / 2);
      }
      var toCurve = {
        x: to.x - FlowNodeDimensions.minHeight,
        y: to.y
      };

      return "M"+from.x+" "+from.y+
             "C"+fromCurve.x+" "+fromCurve.y+","+
              toCurve.x+" "+toCurve.y+","+
              to.x+" "+to.y;
    }

    return {
      render: function (snap, link, flow, loc, classes) {
        var path = linkPath(link, flow.nodes, loc);
        if (!path){
          return;
        }
        //console.log('renderLink:',link);
        var snapLink = snap.path(path)
          .toggleClass('flow-link', true)
          .toggleClass('selected', (link === flow.selectedLink));

        if (link) {
          snapLink.toggleClass('flow-link-to-'+link.to,true)
          snapLink.toggleClass('flow-link-from-'+link.from,true)
        }

        _.each(classes,function(classs){
          snapLink.toggleClass(classs,true);
        });

        snap.select(".flow-link-area").append(snapLink);
        return snapLink;
      }
    }
  });
