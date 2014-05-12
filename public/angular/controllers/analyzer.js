'use strict';

angular.module('octobluApp')
    .controller('analyzerController',function ($rootScope, $scope, $http, $injector, $cookies, elasticService, ownerService) {
        $rootScope.checkLogin($scope, $http, $injector, true, function () {

            // Get user devices
            ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function(data) {
                $scope.devices = data.devices;
                for (var i in $scope.devices) {
                    if($scope.devices[i].type == 'gateway'){
                        $scope.devices.splice(i,1);
                    }
                }
            });


            $scope.currentPage = 1;

            $scope.$watch('currentPage', function(newValue, oldValue) {
              $scope.currentPage = newValue;
              $scope.search(newValue);
            });

            $scope.search = function (currentPage) {
              $scope.results="searching...";
                if ($scope.searchText !== undefined) {
                    elasticService.search($scope.searchText, $scope.skynetuuid, currentPage, $scope.eventCode, function (error, response) {
                        if (error) {
                            console.log(error);
                        } else {
                          $scope.results = response;

                          $scope.totalItems = response.hits.total;
                          $scope.maxSize = 10;

                        }
                    });

                } else {
                    $scope.results="";

                }

            };

            elasticService.getEvents("", function(data) {
                $scope.events = data;
            });

            $scope.setPage = function (pageNo) {
              $scope.currentPage = pageNo;
            };

            // SETUP CHART
            // http://smoothiecharts.org/tutorial.html

            // var line1 = new TimeSeries();
            // var line2 = new TimeSeries();

            // setInterval(function() {
            //   line1.append(new Date().getTime(), Math.random()*100);
            //   line2.append(new Date().getTime(), Math.random()*100);
            // }, 1000);

            // for(var i =0; i < 10; i++){
            //   var this['line' + i] = new TimeSeries();
            // }

            var line = [];
            for(var i =0; i < 10; i++){
              line[i] = new TimeSeries();
            }            



            var smoothie = new SmoothieChart({ grid: { strokeStyle: 'rgb(125, 0, 0)', fillStyle: 'rgb(60, 0, 0)', lineWidth: 1, millisPerLine: 250, verticalSections: 6 } });
            smoothie.addTimeSeries(line[1], { strokeStyle: 'rgb(0, 255, 0)', fillStyle: 'rgba(0, 255, 0, 0.4)', lineWidth: 3 });
            smoothie.addTimeSeries(line[2], { strokeStyle: 'rgb(255, 0, 255)', fillStyle: 'rgba(255, 0, 255, 0.3)', lineWidth: 3 });

            smoothie.streamTo(document.getElementById("mycanvas"), 1000);

            // connect to skynet
            var skynetConfig = {
                'host': 'http://skynet.im',
                'port': 80,
                'uuid': $scope.skynetuuid,
                'token': $scope.skynettoken
            };

            skynet(skynetConfig, function (e, socket) {
                if (e) throw e;

                // Get user's devices
                ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function (data) {
                    $scope.devices = data.devices;

                   // Subscribe to user's devices messages and events
                   if (data.devices) {
                       _.each(data.devices, function (device) {
                           socket.emit('subscribe', {
                               'uuid': device.uuid,
                               'token': device.token
                           }, function (data) {
                               // console.log(data);
                           });

                       });
                   }

                });

                socket.on('message', function (message) {
                  // plot data
                  // {"payload":{"uuid":"99ede351-d6f6-11e3-abcd-1d32e7e917fb","temperature":"78","ipAddress":"70.171.192.231"},"devices":"99ede351-d6f6-11e3-abcd-1d32e7e917fb"}
                  
                  // remove standard data from payload
                  var sensorData = message.payload;
                  delete sensorData.uuid;
                  delete sensorData.ipAddress;
                  delete sensorData.api;

                  console.log(sensorData);

                  var index = 0
                  for (var property in sensorData) {
                      if (sensorData.hasOwnProperty(property)) {
                        index = index + 1
                        console.log('+' + sensorData[property] + '+');
                        if (sensorData[property] != undefined){
                          if (index == 1){
                            line[index].append(new Date().getTime(), sensorData[property] *1);  
                          } else if (index == 2){
                            line[index].append(new Date().getTime(), sensorData[property] *1);  
                          }
                          
                        }
                      }
                  }

                  // line1.append(new Date().getTime(), Math.random());
                  // line2.append(new Date().getTime(), Math.random());


                });

            });

        });
    });
