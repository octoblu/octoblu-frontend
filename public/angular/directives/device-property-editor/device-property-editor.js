angular.module('octobluApp')
    .directive('devicePropertyEditor', function () {
        return {
            restrict: 'AE',
            templateUrl: 'angular/directives/device-property-editor/device-property-editor.html',
            replace: true,
            scope: {
                deviceToEdit: '=', 
                control : '='
            },
            controller: function ($scope) {
                var readOnlyKeys = ['name', 'type', 'subtype', 'uuid', 'token', 'resource', 'socketid', '_id', 'owner', 'timestamp', 'online', 'channel', 'protocol',
                        'localhost','secure', 'eventCode', 'updateWhitelist', 'viewWhitelist', 'sendWhitelist', 'receiveWhitelist'],
                    originalDevice;

                $scope.$watch('deviceToEdit', function (newDevice, oldDevice) {
                    console.log('device changed!');
                    console.log(newDevice);
                    if (newDevice) {
                        originalDevice = newDevice;
                        if(newDevice.type === 'gateway' || newDevice.type === 'octobluMobile'){
                            readOnlyKeys = _.unique(_.union(readOnlyKeys, ['ipAddress', 'port','subdevices', 'plugins']));
                        }
                        $scope.deviceProperties = _.omit(angular.copy(originalDevice), readOnlyKeys);
                    }
                });

                $scope.addProperty = function () {
                    $scope.deviceProperties[$scope.newProperty] = '';
                    $scope.newProperty = '';
                };

                $scope.removeProperty = function (property) {
                    delete $scope.deviceProperties[property];
                };

                if ($scope.control) {
                    $scope.control.getProperties = function () {
                        return _.omit($scope.deviceProperties, readOnlyKeys);
                    };
                }
            }
        }
    });
