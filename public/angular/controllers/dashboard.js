'use strict';

angular.module('e2eApp')
    .controller('dashboardController', function ($rootScope, $scope, $http, $injector, $location, ownerService) {
        $scope.message = 'Contact page content pending.';

        $rootScope.checkLogin($scope, $http, $injector, false, function () {
            var dataPoints = [];
            var deviceData = [];
            var chart;

            // connect to skynet
            var skynetConfig = {
                "uuid": $scope.skynetuuid,
                "token": $scope.skynettoken
            }
            skynet(skynetConfig, function (e, socket) {
                if (e) throw e

                // Get user's devices
                ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function(data) {
                    $scope.devices = data.devices;

                    // Subscribe to user's devices messages and events
                    if(data.devices) {
                        for (var i = 0; i < data.devices.length; i++) {
                            socket.emit('subscribe', {
                                "uuid": data.devices[i].uuid,
                                "token": data.devices[i].token
                            }, function (data) {
                                // console.log(data);
                            });

                            // Setup dashboard arrays for devices
                            dataPoints.push({label: data.devices[i].name, y: 0, uuid: data.devices[i].uuid });
                            deviceData[data.devices[i].uuid] = 0;

                        }

                    }

                    // http://canvasjs.com/ << TODO: pucharse $299
                    chart = new CanvasJS.Chart("chartContainer", {
                        theme: "theme2",//theme1
                        title: {
                            //text: "Real-time Device Activity"
                        },
                        data: [
                            {
                                // Change type to "column", bar", "splineArea", "area", "spline", "pie",etc.
                                type: "splineArea",
                                dataPoints: dataPoints
                            }
                        ]
                    });

                    chart.render();

                });

                socket.on('message', function(channel, message){

                    if($scope.skynetuuid == channel){
                        alert(JSON.stringify(message));
                    }

                    console.log('message received', channel, message);
                    deviceData[channel] = deviceData[channel] + 1;
                    for (var i = 0; i < dataPoints.length; i++) {
                        if(dataPoints[i].uuid == channel){
                            dataPoints[i].y = deviceData[channel];
                        }
                    }
                    chart.options.data[0].dataPoints = dataPoints
                    chart.render();

                });
            });

        });
    });