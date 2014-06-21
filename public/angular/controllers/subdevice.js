angular.module('octobluApp')
    .controller('AddEditSubDeviceController', function ($scope, $modalInstance, selectedHub, subdevice, plugin, availableDeviceTypes) {
        $scope.hub = selectedHub;
        $scope.subdevice = angular.copy(subdevice) || { options: {} };
        $scope.nameEditable = !subdevice.name;
        $scope.smartDevices = availableDeviceTypes;
        $scope.plugin = plugin;
        $scope.schemaEditor = {};

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        $scope.save = function () {
            var errors = $scope.schemaEditor.validate();
            if (!errors.length) {
                $modalInstance.close($scope.subdevice);
            }
        };
    });
