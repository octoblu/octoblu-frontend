'use strict';
angular.module('octobluApp')
  .factory('FlowModel', function (UUIDService) {
    return function (options) {
      var flowId, name, nodes, links, zoomScale, zoomX, zoomY;
      options = options || {};

      flowId = options.flowId || UUIDService.v1();
      name  = options.name;
      nodes = options.nodes || [];
      links = options.links || [];
      zoomScale = options.zoomScale || 1;
      zoomX = options.zoomX || 0;
      zoomY = options.zoomY || 0;

      var FlowModel = {
        getFlowId: function(){
          return flowId;
        },

        getName: function(){
          return name;
        },

        setName : function(newName){
          name = newName;
        },

        getZoomScale: function(){
          return zoomScale;
        },

        setZoomScale: function(newZoomScale){
          if(newZoomScale > 8) {
            return zoomScale = 8;
          }
          if (newZoomScale < 0.25) {
            return zoomScale = 0.25;
          }
          zoomScale = newZoomScale;
        },

        getZoomX: function(){
          return zoomX;
        },

        setZoomX: function(newZoomX){
          zoomX = newZoomX;
        },

        getZoomY: function(){
          return zoomY;
        },

        setZoomY: function(newZoomY){
          zoomY = newZoomY;
        },

        getNodes: function () {
          return nodes;
        },

        addNode: function (node) {
          var match = _.findWhere(nodes, {id: node.id});
          if (match) {
            node.id = UUIDService.v1();
          }
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
      FlowModel.__defineSetter__('name', FlowModel.setName);

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

      FlowModel.__defineGetter__('zoomScale', FlowModel.getZoomScale);
      FlowModel.__defineSetter__('zoomScale', FlowModel.setZoomScale);

      FlowModel.__defineGetter__('zoomX', FlowModel.getZoomX);
      FlowModel.__defineSetter__('zoomX', FlowModel.setZoomX);

      FlowModel.__defineGetter__('zoomY', FlowModel.getZoomY);
      FlowModel.__defineSetter__('zoomY', FlowModel.setZoomY);

      return FlowModel;
    };

  });
