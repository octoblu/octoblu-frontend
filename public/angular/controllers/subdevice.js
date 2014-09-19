'use strict';
angular.module('octobluApp')
    .controller('AddEditSubDeviceController', function ($q, $scope, $modalInstance, hubs, subdevice, pluginName, availableNodeTypes, PluginService) {
        $scope.model = {
            hub: hubs[0],
            hubs: hubs,
            subdevice : subdevice || { options: {}, type: pluginName },
            nameEditable : !subdevice || !subdevice.name,
            smartDevices : availableNodeTypes,
            nodeType  : _.findWhere(availableNodeTypes, function(nodeType){
                return nodeType.skynet.plugin === pluginName;
            }),
            schemaEditor: {}
        };

        $scope.$watch('model.hub', function(newHub){
            var installedPlugin = _.findWhere(newHub.plugins, {name: pluginName});
            if (!installedPlugin) {
                PluginService.installPlugin($scope.model.hub, pluginName)
                    .then(function(result){
                        var defer = $q.defer();
                        setTimeout(function(){
                            defer.resolve(result);
                        }, 5000);
                        return defer.promise;
                    })
                    .then(function (result) {
                        return PluginService.getInstalledPlugins($scope.model.hub);
                    })
                    .then(function (result) {
                        newHub.plugins = result;
                        $scope.model.plugin = _.findWhere(newHub.plugins, {name: pluginName})
                    });
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
                $scope.model.subdevice.options = $scope.model.schemaEditor.getValue();
                $modalInstance.close({hub: $scope.model.hub, nodeType: $scope.model.nodeType, subdevice: $scope.model.subdevice, isNew: $scope.model.isNew});
            }
        };
    });
