angular.module('octobluApp')
    .controller('AddSubDeviceController',  function ($rootScope, $scope, $q,  $modalInstance, PluginService,  mode, hubs, smartDevice )
    {
        $scope.hubs = hubs || [];
        $scope.mode = mode;
        $scope.smartDevice = smartDevice;
        $scope.deviceProperties;
        $scope.selectedHub = $scope.hubs[0];


        if($scope.selectedHub){
            var installedPlugin = _.findWhere($scope.selectedHub.plugins, { name : smartDevice.plugin });
            if( installedPlugin ){

                var optionsProperties = installedPlugin.optionsSchema.properties || {};
                $scope.deviceProperties = _.chain(_.pairs(optionsProperties))
                    .map(function(optionsPair){
                        var deviceProperty = {
                            name : optionsPair[0],
                            required : optionsPair[1].required || false,
                            type : optionsPair[1].type || "String",
                            value : ""
                        };
                        return deviceProperty;
                }).value();

            }

        }



        $scope.getDefaults = function(hub){

//            PluginService.getDefaultOptions(hub, smartDevice.plugin)
//                .then(function(result){
//                    console.log(JSON.stringify(result));
//                }, function(error){
//
//                });


        };


        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.closeAlert = function(validationError){
            $scope.validationErrors = _.without($scope.validationErrors, validationError) ;
        }

        $scope.validate = function(subDeviceName, hub, deviceProperties){
            var errors = [];
            var idIndex = 0;
            if(subDeviceName === undefined || subDeviceName.length === 0){
                errors.push(
                    {
                        type : 'danger',
                        summary : 'Device Name Required',
                        msg : 'Device Name is required. Please enter a device name.'
                    }
                )
            }
            var duplicateSubDevice = _.findWhere(hub.subdevices, {'name' : subDeviceName });

            if(duplicateSubDevice){
                errors.push({
                    type : 'danger',
                    summary : 'Duplicate sub-device name: ' + subDeviceName,
                    msg : $scope.selectedHub.name + ' already has a sub-device with name = ' + subDeviceName
                });

                var devicePropertiesWithErrors =  _.filter( deviceProperties, function(deviceProperty){
                    if(deviceProperty.required ){
                        if(deviceProperty.value === undefined || deviceProperty.value.length === 0){
                            return true;
                        }
                    }
                    return false;
                }) ;

                if(devicePropertiesWithErrors){
                    var optionsErrors =  _.map(devicePropertiesWithErrors, function(deviceProperty){
                        return {
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

        $scope.addSubDevice = function(subDeviceName, selectedHub, smartDevice, deviceProperties) {
            var errors = this.validate(subDeviceName, selectedHub, deviceProperties);
            if( errors.length === 0 ){
                var deviceOptions = _.map(deviceProperties, function(deviceProperty){
                    var option = {};
                    option[deviceProperty.name] = deviceProperty.value;
                    return option;
                });

                $modalInstance.close(
                    {
                        name : subDeviceName,
                        hub : selectedHub,
                        device : smartDevice,
                        options : deviceOptions
                    });
            } else{
                $scope.validationErrors = errors;
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
        $scope.ok = function(deviceProperties){

            var deviceOptions = _.map(deviceProperties, function(deviceProperty){
                var option = {};
                option[deviceProperty.name] = deviceProperty.value;
                return option;
            });

            $modalInstance.close(deviceOptions);
        }
    });
