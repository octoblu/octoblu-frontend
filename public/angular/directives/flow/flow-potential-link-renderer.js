angular.module('octobluApp')
  .service('LinkRenderer', function (FlowLinkRenderer) {
    function exact(loc) {
      if (!loc) {return;}
      var res = _.clone(loc);
      res.exact = true;
      return res;
    }
    return {
      render: function (snap, from, to, link, nodeMap, snapLink, classes) {
        return FlowLinkRenderer.render(
          snap, link, nodeMap,
          {from:exact(from), to:exact(to)},
          snapLink, classes);
      }
    }
  }
);
