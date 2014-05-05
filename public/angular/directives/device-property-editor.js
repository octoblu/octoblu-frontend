angular.module('octobluApp')
    .directive('devicePropertyEditor', function () {
        return {
            restrict: 'A',
            replace: true,
            transclude : true,
            scope: {
                schema: '=',
                id : '@',
                editorValue : '&editorValue',
                validateProperties : '&validateProperties'
            },
            link: function (scope, element, attr) {


                if(scope.schema){

                    var deviceProperties = _.map(scope.schema.properties, function(schemaProperty){
                        var propertyValue = scope.schema.properties[propertyKey];
                        var deviceProperty = {};
                        deviceProperty.name = propertyKey;
                        deviceProperty.type = propertyValue.type;
                        deviceProperty.required = propertyValue.required;
                        deviceProperty.value = "";
                        return deviceProperty;
                    });
                    scope.deviceProperties = deviceProperties;

                }
            }
        }
    });
