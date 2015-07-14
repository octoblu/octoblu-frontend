angular.module('octobluApp')
  .service('FlowLinkRenderer', function (FlowNodeDimensions) {

    function linkPath(link, nodeMap, loc) {
      var sourceNode, targetNode;
      var from, fromCurve, toCurve, to;

      if (link && link.from && nodeMap) {
        sourceNode = nodeMap[link.from];
      }
      if (link && link.to && nodeMap) {
        targetNode = nodeMap[link.to];
      }
      if (!link) {
        link = {};
      }

      if (loc && loc.from) {
        from = _.clone(loc.from);
      } else {
        if (!sourceNode) { return; }
        from = {x:sourceNode.x, y:sourceNode.y};
      }
      if (loc && loc.to) {
        to = _.clone(loc.to);
      } else {
        if (!targetNode) { return; }
        to = {x:targetNode.x, y:targetNode.y};
      }

      if (!sourceNode) {
        sourceNode = {};
      }
      if (!targetNode) {
        targetNode = {};
      }

      if (!from.exact) {
        from.x += FlowNodeDimensions.width;
        from.y += FlowNodeDimensions.minHeight/2;
      }
      var fromCurve = {
        x: from.x + FlowNodeDimensions.minHeight,
        y: from.y
      };

      if (!to.exact) {
        to.y += FlowNodeDimensions.minHeight/2;
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

    function getLinkId(link) {
      if (!_.isObject(link)) return;
      return "link-from-"+link.from+"-to-"+link.to;
    }

    return {
      getLinkId: getLinkId,

      render: function (snap, link, flowMap, loc, snapLink, classes) {
        var path = linkPath(link, flowMap, loc);
        if (!path){
          return;
        }
        if (!snapLink) {
          snapLink = snap.path(path);
        } else {
          snapLink.attr({d:path});
        }

        snap.select(".flow-link-area").append(snapLink);
        snapLink.addClass('flow-link');

        if (link && link.to) {
          snapLink.addClass('flow-link-to-'+link.to);
        }
        if (link && link.from) {
          snapLink.addClass('flow-link-from-'+link.from);
        }
        if (link && link.from && link.to) {
          snapLink.attr({id:getLinkId(link)});
        }
        _.each(classes,function(claz){
          snapLink.addClass(claz);
        });

        return snapLink;
      }
    }
  });
