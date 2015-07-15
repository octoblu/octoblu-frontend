'use strict';
angular.module('octobluApp')
.factory('FlowModel', function (UUIDService) {
  return function (options) {
    var flowId, name, description, nodes, hash, links, token, zoomScale, zoomX, zoomY;
    options = options || {};
    return {
      flowId      : options.flowId || UUIDService.v1(),
      token       : options.token,
      name        : options.name,
      description : options.description,
      hash        : options.hash,
      nodes       : options.nodes || [],
      links       : options.links || []
    }
  };

});
