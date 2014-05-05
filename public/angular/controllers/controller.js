'use strict';

angular.module('octobluApp')
    .controller('controllerController', function ($rootScope, $scope, $http, $injector, $location, ownerService, messageService) {
        $rootScope.checkLogin($scope, $http, $injector, false, function(){
            // Get user gateways
            ownerService.getGateways($scope.skynetuuid, $scope.skynettoken, true, function(error, data) {
                if(error) {
                    console.log('Error' + error);
                }
                console.log('Devices and Gateways', data);
                $scope.devices = data.gateways;
            });

            // connect to skynet
            var skynetConfig = {
                "uuid": $scope.skynetuuid,
                "token": $scope.skynettoken
            }
            skynet(skynetConfig, function (e, socket) {
                if (e) throw e

                $scope.getSubdevices = function (device){
                    if (device.type == 'gateway'){
                        $scope.subdevices = device.subdevices;
                    }
                }


                $scope.getSchema = function (device, subdevice){
                    console.log('device', device);
                    console.log('subdevice', subdevice);
                    $('#device-msg-editor').jsoneditor('destroy');

                    for (var i in device.plugins) {
                        var plugin = device.plugins[i];
                        if(plugin.name === subdevice.type && plugin.messageSchema){
                            $scope.schema = plugin.messageSchema;
                            $scope.schema.title = subdevice.name;
                        }
                    }
                    console.log($scope.schema);

                    if($scope.schema ){

                        $('#device-msg-editor').jsoneditor({
                            schema : $scope.schema,
                            theme  : 'bootstrap3',
                            no_additional_properties: true,
                            iconlib : 'bootstrap3'
                        });

                    }
                };


                socket.on('message', function(channel, message){
                    alert('Message received from ' + channel + ': ' + message);
                });


                $scope.sendMessage = function(){
                    /*
                     if schema exists - get the value from the editor, validate the input and send the message if valid
                     otherwise notify the user that there was an error.

                     if no schema exists, they are doing this manually and we check if the UUID field is populated and that
                     there is a message to send.
                     */

                    var message;

                    if($scope.sendUuid === undefined || $scope.sendUuid == ""){
                        if($scope.device){
                            var uuid = $scope.device.uuid;
                        } else {
                            var uuid = "";
                        }
                    } else {
                        var uuid = $scope.sendUuid;
                    }

                    if(uuid){

                        if($scope.schema){
                            var errors = $('#device-msg-editor').jsoneditor('validate');
                            if(errors.length){
                                alert(errors);
                            } else{
                                // if ($scope.sendText != ""){
                                //   message = $scope.sendText;
                                //   if(typeof message == "string"){
                                //     message = JSON.parse($scope.sendText);
                                //   }
                                // } else {
                                message = $('#device-msg-editor').jsoneditor('value');
                                console.log('schema message', message);
                                // }

                                $scope.subdevicename = $scope.subdevice.name;
                            }

                        } else{
                            message = $scope.sendText;
                            try{
                                if(typeof message == "string"){
                                    message = JSON.parse($scope.sendText);
                                }
                                // message = message.message;
                                $scope.subdevicename = message.subdevice;
                                delete message["subdevice"];

                            } catch(e){
                                message = $scope.sendText;
                                $scope.subdevicename = "";
                            }

                        }


                        socket.emit('message', {
                            "devices": uuid,
                            "subdevice": $scope.subdevicename,
                            "message": message
                        }, function(data){
                            console.log(data);
                        });
                        $scope.messageOutput = "Message Sent: " + JSON.stringify(message);

                    }
                }

            });

        });
    });
