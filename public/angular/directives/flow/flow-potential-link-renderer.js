angular.module('octobluApp')
  .service('LinkRenderer', function (FlowNodeDimensions,FlowLinkRenderer) {
    function noPort(loc) {
      var res = _.clone(loc);
      res.noPort = true;
      return res;
    }
    return {
      render: function (snap, from, to) {
        return FlowLinkRenderer.render(snap,null,{},{from:noPort(from),to:noPort(to)},['flow-potential-link']);
      }
    }
  });
