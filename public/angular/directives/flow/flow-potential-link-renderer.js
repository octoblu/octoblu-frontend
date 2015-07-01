angular.module('octobluApp')
  .service('LinkRenderer', function (FlowNodeDimensions,FlowLinkRenderer) {
    function exact(loc) {
      var res = _.clone(loc);
      res.exact = true;
      return res;
    }
    return {
      render: function (snap, from, to) {
        return FlowLinkRenderer.render(snap,null,{},{from:exact(from),to:exact(to)},['flow-potential-link']);
      }
    }
  });
