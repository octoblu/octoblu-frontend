angular.module('octobluApp')
    .service('FlowService', function ($http, $q) {
        'use strict';

        var service = this;

        this.saveAllFlows = function (flows) {
            var promises;

            promises = _.map(flows, function (flow) {
                return $http.put("/api/flows/" + flow.flowId, flow);
            });

            return $q.all(promises);
        };

        this.saveAllFlowsAndDeploy = function (flows) {
            return service.saveAllFlows(flows).then(function () {
                return service.deploy();
            });
        };

        this.deploy = function(){
            return $http.post("/api/flow_deploys");
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
