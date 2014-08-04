angular.module('octobluApp')
    .service('FlowService', function ($http, $q) {
        'use strict';

        var service = this;

        this.designerToFlows = function (designerNodes) {
            var workspaces = _.where(designerNodes, {type: 'tab'});

            return _.map(workspaces, function (workspace) {
                return {
                    id: workspace.id,
                    name: workspace.label,
                    nodes: service.extractNodesByWorkspaceId(designerNodes, workspace.id),
                    links: service.extractLinksByWorkspaceId(designerNodes, workspace.id)
                };
            });
        };

        this.extractNodesByWorkspaceId = function (designerNodes, workspaceId) {
            var justNodes = _.where(designerNodes, {z: workspaceId});

            return _.map(justNodes, function (designerNode) {
                return _.omit(designerNode, 'z', 'wires');
            });
        };

        this.extractLinksByWorkspaceId = function (designerNodes, workspaceId) {
            var workspaceNodes = _.where(designerNodes, {z: workspaceId});

            var links = [];
            _.each(workspaceNodes, function (workspaceNode) {
                _.each(workspaceNode.wires, function(wires, portIndex){
                    _.each(wires, function (wire) {
                        links.push({
                            from: workspaceNode.id,
                            fromPort: ''+portIndex,
                            to: wire,
                            toPort: '0'
                        });
                    });
                });
            });
            return links;
        };

        this.saveAllFlows = function (designerNodes) {
            var flows, promises;

            flows = service.designerToFlows(designerNodes);

            promises = _.map(flows, function (flow) {
                return $http.put("/api/flows/" + flow.id, flow);
            });

            return $q.all(promises);
        };

        this.saveAllFlowsAndDeploy = function (designerNodes) {
            return service.saveAllFlows(designerNodes).then(function () {
                return $http.post("/api/flow_deploys");
            });
        };

        this.getAllFlows = function () {
            return $http.get("/api/flows").then(function(response){
                return response.data;
            });
        };

        this.getSessionFlow = function () {
            return $http({method: 'GET', url: '/api/get/flow'})
                .then(function (response) {
                    return response.data.flow;
                });
        };
    });
