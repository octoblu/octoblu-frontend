angular.module('octobluApp')
    .controller('AddEditSubDeviceController', function ($scope, $modalInstance, hubs, subdevice, pluginName, availableDeviceTypes, PluginService) {
        $scope.hubs = hubs;
        $scope.hub = hubs[0];
        $scope.subdevice = angular.copy(subdevice) || { options: {}, type: pluginName };
        $scope.nameEditable = !subdevice || !subdevice.name;
        $scope.smartDevices = availableDeviceTypes;
        $scope.schemaEditor = {};
        $scope.$watch('hub', function(newHub){
            var installedPlugin = _.findWhere(newHub.plugins, {name: pluginName});
            if (!installedPlugin) {
                PluginService.installPlugin($scope.hub, pluginName)
                    .then(function (result) {
                        return PluginService.getInstalledPlugins($scope.hub);
                    })
                    .then(function (result) {
                        console.log(result);
                        newHub.plugins = result.result;
                        $scope.plugin = _.findWhere(newHub.plugins, {name: pluginName})
                    })
            } else {
                $scope.plugin = installedPlugin;
            }
        }, true);
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        $scope.save = function () {
            var errors = $scope.schemaEditor.validate();
            if (!errors.length) {
                $modalInstance.close({hub: $scope.hub, subdevice: $scope.subdevice});
            }
        };
    });
