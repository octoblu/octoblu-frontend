'use strict';
angular.module('octobluApp')
  .factory('FlowModel', function (UUIDService) {
    return function (options) {
      var flowId, name, nodes, links, zoomCenterX, zoomCenterY, zoomScale;
      options = options || {};

      flowId = options.flowId || UUIDService.v1();
      name  = options.name;
      nodes = options.nodes || [];
      links = options.links || [];
      zoomCenterX = 1;
      zoomCenterY = 1;
      zoomScale   = 1;

      var FlowModel = {
        getFlowId: function(){
          return flowId;
        },

        getName: function(){
          return name;
        },

        getZoomCenterX: function(){
          return zoomCenterX;
        },

        setZoomCenterX: function(newZoomCenterX){
          zoomCenterX = newZoomCenterX;
        },

        getZoomCenterY: function(){
          return zoomCenterY;
        },

        setZoomCenterY: function(newZoomCenterY){
          zoomCenterY = newZoomCenterY;
        },

        getZoomScale: function(){
          return zoomScale;
        },

        setZoomScale: function(newZoomScale){
          zoomScale = newZoomScale;
        },

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

      //Shim so things that expect array primitives still work.

      FlowModel.__defineGetter__('flowId', FlowModel.getFlowId);
      FlowModel.__defineGetter__('name', FlowModel.getName);

      FlowModel.__defineGetter__('nodes', function () {
        return FlowModel.getNodes();
      });

      FlowModel.__defineSetter__('nodes', function (newNodes) {
        var nodesToRemove = _.without(nodes, newNodes);

        _.each(nodesToRemove, function (node) {
          FlowModel.removeNode(node);
        });

        nodes = newNodes;

      });

      FlowModel.__defineGetter__('links', function () {
        return FlowModel.getLinks();
      });

      FlowModel.__defineSetter__('links', function (newLinks) {
        links = newLinks;
      });

      FlowModel.__defineGetter__('zoomCenterX', FlowModel.getZoomCenterX);
      FlowModel.__defineGetter__('zoomCenterY', FlowModel.getZoomCenterY);
      FlowModel.__defineGetter__('zoomScale', FlowModel.getZoomScale);

      FlowModel.__defineSetter__('zoomCenterX', FlowModel.setZoomCenterX);
      FlowModel.__defineSetter__('zoomCenterY', FlowModel.setZoomCenterY);
      FlowModel.__defineSetter__('zoomScale', FlowModel.setZoomScale);

      return FlowModel;
    };

  });
