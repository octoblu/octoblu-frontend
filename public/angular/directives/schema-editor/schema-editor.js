angular.module('octobluApp')
    .directive('schemaEditor', function () {
        return {
            restrict: 'AE',
            templateUrl: 'angular/directives/schema-editor/schema-editor.html',
            replace: true,
            scope: {
                schema: '=',
                model: '=',
                additionalProperties: '=',
                allowJsonEdit : '='
            },
            link: function(scope, element, attrs) {
                var schema = _.extend({ title : 'Options'}, scope.schema);
                var editor = new JSONEditor(element[0],
                    {schema: schema,
                        no_additional_properties: !scope.additionalProperties,
                        theme: 'bootstrap3',
                        startval: scope.model,
                        disable_collapse: true,
                        disable_edit_json : ! scope.allowJsonEdit

                    });
                editor.on('change', function(){
                   angular.copy(editor.getValue(), scope.model);
                    scope.$apply();
                });
            }
        }
    });
