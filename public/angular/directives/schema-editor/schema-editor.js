angular.module('octobluApp')
    .directive('schemaEditor', function () {
        return {
            restrict: 'AE',
            templateUrl: 'angular/directives/schema-editor/schema-editor.html',
            replace: true,
            scope: {
                schema: '=',
                model: '=',
                additionalProperties: '='
            },
            link: function(scope, element, attrs) {
                var editor = new JSONEditor(element[0],
                    {schema: scope.schema,
                        no_additional_properties: !scope.additionalProperties,
                        theme: 'bootstrap3',
                        startval: scope.model,
                        disable_collapse: true
                    });
                editor.on('change', function(){
                   angular.copy(editor.getValue(), scope.model);
                    scope.$apply();
                });
            }
        }
    });
