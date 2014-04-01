angular.module('e2eApp')
    .controller('AddSubDeviceController',  function ($rootScope, $scope, $modalInstance, mode, hubs, smartDevice )
    {
        $scope.hubs = hubs;
        $scope.mode = mode;
        $scope.smartDevice = smartDevice;

        $scope.selectedHub = $scope.hubs[0];
        $scope.plugins = $scope.hubs[0].plugins;

        $scope.devicePlugin = _.findWhere($scope.plugins, {name: smartDevice.plugin});

        var keys = _.keys($scope.devicePlugin.optionsSchema.properties);

        var deviceProperties = _.map(keys, function(propertyKey){
            var propertyValue = $scope.devicePlugin.optionsSchema.properties[propertyKey];
            var deviceProperty = {};
            deviceProperty.name = propertyKey;
            deviceProperty.type = propertyValue.type;
            deviceProperty.required = propertyValue.required;
            deviceProperty.value = "";
            return deviceProperty;
        });
        $scope.deviceProperties = deviceProperties;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.save = function(selectedHub){
            $modalInstance.close(selectedHub, $scope.smartDevice);
        }
    })
    .controller('EditSubDeviceController',  function ($rootScope, $scope, $modalInstance, mode, hub, subdevice, plugins, smartDevices )
    {
        $scope.mode = mode;
        $scope.subdevice = subdevice;

        $scope.hub = hub;

        $scope.plugins = plugins;

        $scope.smartDevices = smartDevices ;

        $scope.devicePlugin = _.findWhere($scope.plugins, {name: subdevice.type});

        $scope.deviceOptions = subdevice.options;

        var keys = _.keys($scope.devicePlugin.optionsSchema.properties);

        var deviceProperties = _.map(keys, function(propertyKey){
            var propertyValue = $scope.devicePlugin.optionsSchema.properties[propertyKey];
            var deviceProperty = {};
            deviceProperty.name = propertyKey;
            deviceProperty.type = propertyValue.type;
            deviceProperty.required = propertyValue.required;
            deviceProperty.value = subdevice.options[propertyKey];
            return deviceProperty;
        });
        $scope.deviceProperties = deviceProperties;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.save = function(valid){
            console.log('valid ' + valid)

            if(valid){
                var deviceOptions = _.map($scope.deviceProperties, function(deviceProperty){
                    var option =  {};
                    option[deviceProperty.name] = deviceProperty.value;
                    return option;
                })  ;
            }






        }
    });

