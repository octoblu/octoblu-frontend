angular.module('octobluApp')
    .directive('schemaEditor', function () {
        return {
            restrict: 'AE',
            templateUrl: '/angular/directives/schema-editor/schema-editor.html',
            replace: true,
            scope: {
                schema: '=',
                model: '=',
                additionalProperties: '=',
                allowJsonEdit: '=',
                validate: '&',
                control: '='
            },
            link: function (scope, element, attrs) {
                var readOnlyKeys = ['name', 'type', 'subtype', 'uuid', 'token', 'resource', 'socketId', 'socketid', '_id', 'owner', 'timestamp', 'online', 'channel', 'protocol',
                        'localhost', 'secure', 'eventCode', 'updateWhitelist', 'viewWhitelist', 'sendWhitelist', 'receiveWhitelist'],
                    originalDevice, schema, editor;
                function initializeEditor() {
                    originalDevice = scope.model;
                    scope.editingDevice = _.omit(angular.copy(originalDevice), readOnlyKeys);
                    schema = _.extend({ title: 'Options'}, scope.schema);

                    if (editor) {
                        editor.destroy();
                    }


                    editor = new JSONEditor(element[0],
                        {schema: schema,
                            no_additional_properties: !scope.additionalProperties,
                            startval: scope.editingDevice,
                            disable_collapse: true,
                            required_by_default: true,
                            disable_edit_json: !scope.allowJsonEdit,
                            theme: 'bootstrap3',
                            iconlib: 'font-awesome4'
                        });

                    editor.on('change', function () {
                        if (editor.getValue()) {
                            angular.copy(editor.getValue(), scope.editingDevice);
                            scope.$apply();
                            
                            if( !scope.control && editor.validate().length === 0 ) {
                                angular.copy(scope.editingDevice, originalDevice);
                            }
                        }
                    });
                }

                scope.$watch('schema', initializeEditor);
                scope.$watch('model', function(){
                    initializeEditor();
                });

                if (scope.control) {
                    scope.control.validate = function () {
                        return editor.validate();
                    };

                    scope.control.getValue = function () {
                        return angular.extend({}, originalDevice, scope.editingDevice);
                    };
                }
            }
        }
    });
