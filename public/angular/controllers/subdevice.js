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

        $scope.validate = function(){
            var errors = [];

            if($scope.deviceName === undefined || $scope.deviceName.length === 0){
                errors.push(
                    {
                        type : 'danger',
                        summary : 'Device Name Required',
                        msg : 'Device Name is required. Please enter a device name.'
                    }
                )
            }
            var duplicateSubDevice = _.findWhere($scope.selectedHub.subdevices, {'name' : $scope.deviceName });
            if(duplicateSubDevice){
                errors.push({
                    type : 'danger',
                    summary : 'Duplicate sub-device name: ' + $scope.deviceName,
                    msg : $scope.selectedHub.name + ' already has a sub-device with name = ' + $scope.deviceName
                });

                var devicePropertiesWithErrors =  _.find( $scope.deviceProperties, function(deviceProperty){
                    if(deviceProperty.required && deviceProperty.value.length === 0){
                        return deviceProperty;
                    }
                }) ;

                if(devicePropertiesWithErrors){
                   var optionsErrors =  _.map(devicePropertiesWithErrors, function(deviceProperty){
                        var error = {
                            type : 'danger',
                            summary : 'Device Option Required',
                            msg : deviceProperty.name + 'is required'
                        }
                    });
                    errors = errors.concat(optionsErrors);
                }
            }
            return errors;
        } ;

        $scope.addSubDevice = function() {
            var validationErrors = $scope.validate();
            if(validationErrors.length === 0 ){
                console.log('add device properties ', deviceProperties);
                $rootScope.skynetSocket.emit('gatewayConfig', {
                    "uuid": $scope.selectedHub.uuid,
                    "token": $scope.selectedHub.token,
                    "method": "createSubdevice",
                    "type": $scope.smartDevice.plugin,
                    "name": $scope.deviceName,
                    "options": deviceOptions
                }, function (addResult) {
                    console.log(addResult);
                });
            } else{
                $scope.validationErrors = validationErrors;
            }
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
        $scope.save = function(){


            console.log('add device properties ', deviceProperties);
            socket.emit('gatewayConfig', {
                "uuid": gateway.uuid,
                "token": gateway.token,
                "method": "createSubdevice",
                "type": pluginName,
                "name": subDeviceName,
                "options": deviceProperties
            }, function (addResult) {
                console.log(addResult);
            });

        }
    });

