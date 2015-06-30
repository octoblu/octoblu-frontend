angular.module('octobluApp')
  .service('LinkRenderer', function (FlowNodeDimensions) {

    function linkPath(from, to) {

      var fromCurve = {
        x: from.x + FlowNodeDimensions.minHeight,
        y: from.y
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
      render: function (snap, from, to) {
        var path = linkPath(from, to)
        if (!path){
          return;
        }
        var link = snap.path(path)
                .toggleClass('flow-link', true)
                .toggleClass('flow-potential-link', true);

        snap.select(".flow-link-area").append(link);
        return link;
      }
    }
  });
