'use strict';
angular.module('octobluApp')
  .constant('FlowModel', function () {
    var nodes = [], links = [];

    var FlowModel = {
      addNode: function (flowNode) {
        nodes.push(flowNode);
      },

      addLink: function (flowLink) {
        links.push(flowLink);

      },

      getNodes: function () {
        return nodes;
      },

      getLinks: function (options) {

        if (options && options.forNode) {
          return _.filter(links, function (link) {
            return link.from === options.forNode ||
              link.to === options.forNode;
          });
        }

        return links;
      }

    };
    return FlowModel;
  });