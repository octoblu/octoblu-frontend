angular.module('octobluApp')
    .service('FlowService', function ($http, $q, FlowModel) {
        'use strict';

        var _this = this;

        this.saveFlow = function (flow) {
            return $http.put("/api/flows/" + flow.flowId, flow);
        };

        this.debouncedSaveFlow = _.debounce(this.saveFlow, 1000);

        this.deploy = function(){
            return $http.post("/api/flow_deploys");
        };

        this.getAllFlows = function () {
            return $http.get("/api/flows").then(function(response){
                if (_.isEmpty(response.data)) {
                    return [_this.newFlow({name: 'Flow 1'})];
                }

                return _.map(response.data, function(data) {
                    return new FlowModel(data);
                });
            });
        };

        this.getSessionFlow = function () {
            return $http({method: 'GET', url: '/api/get/flow'})
                .then(function (response) {
                    return response.data.flow;
                });
        };

        this.newFlow = function(options) {
            return FlowModel(options);
        };

        this.deleteFlow = function(flowId){
          return $http.delete('/api/flows/' + flowId).then(function(response){
            return response.data;
          });
        }
    });
