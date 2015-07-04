angular.module('octobluApp')
  .service('LinkRenderer', function (FlowNodeDimensions,FlowLinkRenderer) {
    function exact(loc) {
      if (!loc) {return;}
      var res = _.clone(loc);
      res.exact = true;
      return res;
    }
    return {
      render: function (snap, from, to, link, nodes, snapLink, classes) {
        return FlowLinkRenderer.render(
          snap, link, {nodes:nodes},
          {from:exact(from), to:exact(to)}, snapLink,
          ['flow-potential-link'].concat(classes));
      }
    }
  }
);
