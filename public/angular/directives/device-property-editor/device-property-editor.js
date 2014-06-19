angular.module('octobluApp')
    .directive('devicePropertyEditor', function () {
        return {
            restrict: 'AE',
            templateUrl : 'angular/directives/device-property-editor/device-property-editor.html',
            replace: true,
            scope: {
                deviceToEdit: '=',
                onSave : '&'
            },
            controller : function($scope) {
                var readOnlyKeys = [ 'uuid', 'token', 'resource',  'socketid', '_id', 'owner', 'timestamp', 'online', 'channel',
                        'eventCode', 'updateWhitelist', 'viewWhitelist', 'sendWhitelist', 'receiveWhitelist'],
                    originalDevice;

                $scope.$watch('deviceToEdit', function(newDevice, oldDevice){
                    console.log('device changed!');
                    console.log(newDevice);
                    if(newDevice) {
                        originalDevice = newDevice;
                        $scope.editingDevice = _.omit(angular.copy(originalDevice), readOnlyKeys);
                    }
                });

                $scope.addProperty = function() {
                    $scope.editingDevice[$scope.newProperty] = '';
                    $scope.newProperty = '';
                };

                $scope.removeProperty = function(property) {
                    delete $scope.editingDevice[property];
                };

                $scope.saveDevice = function() {
                    _.each(_.pairs($scope.editingDevice), function (pair) {
                        var key = pair[0], value = pair[1];
                        originalDevice[key] = value;
                    });
                    delete $scope.editingDevice;
                    $scope.onSave();
                };
            }
        }
    });
