angular.module('octobluApp')
    .service('FlowService', function ($http, $q, FlowModel) {
        'use strict';

        var _this = this;

        this.saveAllFlows = function (flows) {
            var promises;

            promises = _.map(flows, function (flow) {
                return $http.put("/api/flows/" + flow.flowId, flow);
            });

            return $q.all(promises);
        };

        this.saveAllFlowsAndDeploy = function (flows) {
            return _this.saveAllFlows(flows).then(function () {
                return _this.deploy();
            });
        };

        this.deploy = function(){
            return $http.post("/api/flow_deploys");
        };

        this.getAllFlows = function () {
            return $http.get("/api/flows").then(function(response){
                if (_.isEmpty(response.data)) {
                    return [_this.newFlow('Flow 1')];
                }

                return response.data;
            });
        };

        this.getSessionFlow = function () {
            return $http({method: 'GET', url: '/api/get/flow'})
                .then(function (response) {
                    return response.data.flow;
                });
        };

        this.newFlow = function(name) {
            return FlowModel(name);
        };
    });
