angular.module('octobluApp')
    .service('FlowNodeTypeService', function ($http, $q) {
        var myFlowNodeTypes = [
            {
                "name": "delay",
                "category": "function",
                "inputs": 1,
                "outputs": 1,
                "ui": {
                    "icon": "timer.png",
                    "color": "#E6E0F8"
                },
                "schema": {
                    "type": "object",
                    "properties": {
                        "pauseType": {
                            "type": "string",
                            "required": true
                        },
                        "timeout": {
                            "type": "integer",
                            "minimum": "1",
                            "required": true
                        },
                        "timeoutUnits": {
                            "type": "string",
                            "default:": "seconds"
                        },
                        "rate": {
                            "type": "integer",
                            "minimum": "1",
                            "required": true
                        }
                    }
                }
            }
        ];

        return {
            getFlowNodeTypes: function () {
                var defer = $q.defer();
                defer.resolve(myFlowNodeTypes);
                return defer.promise;
            }
        };
    });

