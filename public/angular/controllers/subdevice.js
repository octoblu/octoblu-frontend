angular.module('octobluApp')
    .controller('AddEditSubDeviceController', function ($scope, $modalInstance, hubs, subdevice, pluginName, availableDeviceTypes, PluginService) {
        $scope.model = {
            hub: hubs[0],
            hubs: hubs,
            subdevice : angular.copy(subdevice) || { options: {}, type: pluginName },
            nameEditable : !subdevice || !subdevice.name,
            smartDevices : availableDeviceTypes,
            deviceType  : _.findWhere(availableDeviceTypes, function(deviceType){
                return deviceType.skynet.plugin === pluginName;
            }),
            schemaEditor: {}
        };

        $scope.$watch('model.hub', function(newHub){
            var installedPlugin = _.findWhere(newHub.plugins, {name: pluginName});
            if (!installedPlugin) {
                PluginService.installPlugin($scope.model.hub, pluginName)
                    .then(function (result) {
                        return PluginService.getInstalledPlugins($scope.model.hub);
                    })
                    .then(function (result) {
                        console.log(result);
                        newHub.plugins = result.result;
                        $scope.model.plugin = _.findWhere(newHub.plugins, {name: pluginName})
                    })
            } else {
                $scope.model.plugin = installedPlugin;
            }
        });

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        $scope.save = function () {
            var errors = $scope.model.schemaEditor.validate();
            if (!errors.length) {
                $modalInstance.close({hub: $scope.model.hub, subdevice: $scope.model.subdevice});
            }
        };
    });
