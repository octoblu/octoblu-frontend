angular.module('octobluApp')
.service('FlowService', function ($http) {
  var service = this;

  this.designerToFlows = function(designerNodes){
    var workspaces = _.where(designerNodes, {type: 'tab'});

    return _.map(workspaces, function(workspace){
      return {
        id:   workspace.id,
        name: workspace.label,
        nodes: service.extractNodesByWorkspaceId(designerNodes, workspace.id),
        links: service.extractLinksByWorkspaceId(designerNodes, workspace.id)
      };
    });
  };

  this.extractNodesByWorkspaceId = function(designerNodes, workspaceId){
    var justNodes = _.where(designerNodes, {z: workspaceId});

    return _.map(justNodes, function(designerNode){
      return _.omit(designerNode, 'z', 'wires');
    });
  };

  this.extractLinksByWorkspaceId = function(designerNodes, workspaceId){
    var workspaceNodes = _.where(designerNodes, {z: workspaceId});

    var links = [];
    _.each(workspaceNodes, function(workspaceNode){
      _.each(_.first(workspaceNode.wires), function(wire){
        links.push({from: workspaceNode.id, to: wire});
      });
    });
    return links;
  };

  this.saveAllFlows = function(designerNodes){
    var flows = service.designerToFlows(designerNodes);

    _.each(flows, function(flow){
      $http.put("/api/flows/" + flow.id, flow);
    });
  };
});
