angular.module('octobluApp')
    .service('FlowService', function ($http, $q) {
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
                _.each(_.first(workspaceNode.wires), function (wire) {
                    links.push({from: workspaceNode.id, to: wire});
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
            var defer = $q.defer();
            defer.resolve(
                [
                    {
                        name: 'Flow 1',
                        nodes: [
                            {
                                "id": "7b8f181f8470e8",
                                "type": "inject",
                                "name": "Inject Node",
                                "x": 44.8888854980469,
                                "y": 181.88888549804688
                            },
                            {
                                "id": "d71fffc928e",
                                "type": "debug",
                                "name": "Wait a sec",
                                "phoneNumber": "aasdsadsad",
                                "plivoAuthId": "dsa",
                                "plivoAuthToken": "asd",
                                "x": 125.888916015625,
                                "y": 2.10415649414062
                            }
                        ],
                        links: [
                            { "from": '7b8f181f8470e8', "to": "d71fffc928e"  }
                        ]
                    },
                    {
                        name : 'Bigger Flow',
                        "nodes": [
                            {
                                "id": "aade37cf5521c8",
                                "type": "inject",
                                "x": 441,
                                "y": 233
                            },
                            {
                                "id": "7c5fb40383a04c",
                                "type": "debug",
                                "x": 744.0000305175781,
                                "y": 164
                            },
                            {
                                "id": "955881926aa78",
                                "type": "function",
                                "x": 600.8888854980469,
                                "y": 256.8888854980469
                            },
                            {
                                "id": "7b8f181f8470e8",
                                "type": "inject",
                                "x": 440.8888854980469,
                                "y": 181.88888549804688
                            },
                            {
                                "id": "d71fffc928e",
                                "type": "delay",
                                "phoneNumber": "aasdsadsad",
                                "plivoAuthId": "dsa",
                                "plivoAuthToken": "asd",
                                "properties": {
                                    "phoneNumber": "aasdsadsad",
                                    "plivoAuthId": "dsa",
                                    "plivoAuthToken": "asd"
                                },
                                "x": 252.888916015625,
                                "y": 251.10415649414062
                            }
                        ],
                        "links": [
                            {
                                "to": "7c5fb40383a04c",
                                "from": "aade37cf5521c8"
                            },
                            {
                                "from": "aade37cf5521c8",
                                "to": "955881926aa78"
                            },
                            {
                                "from": "955881926aa78",
                                "to": "7c5fb40383a04c"
                            },
                            {
                                "from": "7b8f181f8470e8",
                                "to": "7c5fb40383a04c"
                            }
                        ]
                    }
                ]
            );

            return defer.promise;
        };

        this.getSessionFlow = function () {
            return $http({method: 'GET', url: '/api/get/flow'})
                .then(function (response) {
                    return response.data.flow;
                });
        };
    });
