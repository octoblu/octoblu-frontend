'use strict';

angular.module('octobluApp')
    .controller('dashboardController', function ($rootScope, $scope, $http, $injector, $location, skynetConfig,  ownerService, channelService, userService) {
        $scope.message = 'Contact page content pending.';

        $rootScope.checkLogin($scope, $http, $injector, false, function () {
            var dataPoints = [];
            var deviceData = [];
            var chart;


            channelService.getActive($scope.skynetuuid, function (data) {
                $scope.channels = data;
            });

            userService.getMessageGraph($scope.skynetuuid, 'now-30d/d', 'day', function (data) {
                $scope.messages = data
            });


            skynetConfig.uuid = $scope.skynetuuid;
            skynetConfig.token = $scope.skynettoken;

            skynet(skynetConfig, function (e, socket) {
                if (e) throw e;

                // Get user's devices
                ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function (data) {
                    $scope.devices = data;
                    console.log(data);
//                    // Subscribe to user's devices messages and events
//                    if (data.devices) {
//                        _.each(data.devices, function (device) {
//                            socket.emit('subscribe', {
//                                'uuid': device.uuid,
//                                'token': device.token
//                            }, function (data) {
//                                // console.log(data);
//                            });
//
//                            // Setup dashboard arrays for devices
//                            dataPoints.push({label: device.name, y: 0, uuid: device.uuid });
//                            deviceData[device.uuid] = 0;
//                        });
//                    }

//                    // http://canvasjs.com/ << TODO: pucharse $299
//                    chart = new CanvasJS.Chart('chartContainer', {
//                        theme: 'theme2',//theme1
//                        title: {
//                            //text: 'Real-time Device Activity'
//                        },
//                        data: [
//                            {
//                                // Change type to 'column', bar', 'splineArea', 'area', 'spline', 'pie',etc.
//                                type: 'splineArea',
//                                dataPoints: dataPoints
//                            }
//                        ]
//                    });

//                    chart.render();

                });

                socket.on('message', function (channel, message) {
//                    if($scope.skynetuuid == channel) {
//                        alert(JSON.stringify(message));
//                    }

                    //console.log('message received', channel, message);

                    //deviceData[channel] = deviceData[channel] + 1;

//                    for (var i = 0; i < dataPoints.length; i++) {
//                        if (dataPoints[i].uuid == channel) {
//                            dataPoints[i].y = deviceData[channel];
//                        }
//                    }

                    //_.findWhere($scope.realtimeMessage

                    //chart.options.data[0].dataPoints = dataPoints;
                    //chart.render();
                });
            });

        });
    });