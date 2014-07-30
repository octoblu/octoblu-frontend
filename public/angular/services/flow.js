angular.module('octobluApp')
.service('FlowService', function ($http) {
  var service = this;

  this.designerToFlows = function(designerNodes){
    var workspaces = _.where(designerNodes, {type: 'tab'});

    return _.map(workspaces, function(workspace){
      return {
        id:   workspace.id,
        name: workspace.label,
        nodes: service.extractNodesByWorkspaceId(designerNodes, workspace.id)
      };
    });
  };

  this.extractNodesByWorkspaceId = function(designerNodes, workspaceId){
    var justNodes = _.where(designerNodes, {z: workspaceId});

    return _.map(justNodes, function(designerNode){
      return _.omit(designerNode, 'z');
    })
  };

  this.saveAllFlows = function(nodes){
    var zs = _.uniq(_.pluck(nodes, 'z'));
    _.each(zs, function(z){
      $http.put("/api/flows/" + z);
    });
  };
});
