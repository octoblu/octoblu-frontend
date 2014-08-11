'use strict';
angular.module('octobluApp')
  .constant('FlowModel', function () {
    var nodes = [], links = [];

    var FlowModel = {

      getNodes: function () {
        return nodes;
      },

      addNode: function (node) {
        nodes.push(node);
      },

      removeNode: function (nodeToRemove) {
        nodes = _.reject(nodes, function (node) {
          return node.id === nodeToRemove;
        });
        links = _.difference(links, FlowModel.getLinksForNode(nodeToRemove));
        return nodes;
      },

      getLinks: function () {
        return links;
      },

      getLinksForNode: function (nodeId) {
        return _.filter(links, function (link) {
          return link.from === nodeId ||
            link.to === nodeId;
        });
      },

      addLink: function (link) {
        links.push(link);

      },

      removeLink: function (linkToRemove) {
        links = _.reject(links, function (link) {
          return _.isEqual(linkToRemove, link);
        });

        return links;
      }
    };

    return FlowModel;
  });