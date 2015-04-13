angular.module('octobluApp')
  .directive('schemaEditor', function ($interval) {
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
        var originalDevice, schema, editor;

        var timeoutId;
        function initializeEditor() {
          $interval.cancel(timeoutId);
          originalDevice = scope.model;
          scope.editingDevice = angular.copy(originalDevice)
          schema = _.extend({ title: 'Options'}, scope.schema);

          if (editor) {
            editor.destroy();
          }

          editor = new JSONEditor(element[0],
            {schema: schema,
              no_additional_properties: !scope.additionalProperties,
              startval: scope.editingDevice,
              disable_collapse: true,
              disable_edit_json: !scope.allowJsonEdit,
              theme: 'bootstrap3',
              iconlib: 'font-awesome4'
            });


          element.on('$destroy', function() {
            $interval.cancel(timeoutId);
          });

          timeoutId = $interval(function(){
            _.each(editor.editors, function(e){
              if(!e || !e.refreshValue) {
                return;
              }
              e.refreshValue();
            });

            var newValue = editor.getValue();
            if (!newValue) {
              return;
            }

            angular.copy(newValue, scope.editingDevice);
            if (!scope.control && editor.validate().length === 0) {
              angular.copy(scope.editingDevice, originalDevice);
            }
          }, 1000);
        }

        scope.$watch('schema', function(){
          console.log('schema change');
          initializeEditor();
        });
        scope.$watch('model', function(){
          console.log('model change');
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
