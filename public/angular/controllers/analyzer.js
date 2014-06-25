'use strict';

angular.module('octobluApp')
    .controller('analyzerController', function ($rootScope, $scope, $http, $injector, elasticService, ownerService, skynetService, currentUser, myDevices) {

        // Get user devices
        console.log("getting devices from ownerService");
        $scope.splunk_devices = "";
        $scope.devices = _.filter(myDevices, function (device) {
            return device.type !== 'gateway';
        });
        $scope.deviceLookup = {};
        _.each($scope.devices, function (device) {
            $scope.splunk_devices += device.uuid + " OR ";
            $scope.deviceLookup[device.uuid] = device.name;
        });

        $scope.devices[$scope.devices.length] = { _id: "_all", name: "All Devices" };
        console.log($scope.devices);
        console.log($scope.splunk_devices);


        $scope.currentPage = 1;

        $scope.$watch('currentPage', function (newValue, oldValue) {
            $scope.search(newValue);
        });

        $scope.search = function (currentPage) {
            $scope.results = "searching...";
            if ($scope.searchText) {
                elasticService.searchAdvanced($scope.searchText, currentUser.skynetuuid, currentPage, $scope.eventCode, function (error, response) {
                    if (error) {
                        console.log(error);
                    } else {
                        $scope.results = response;

                        $scope.totalItems = response.hits.total;
                        $scope.maxSize = 10;

                    }
                });

            } else {
                $scope.results = "";

            }

        };

        //Load Top Counts Panels On init of page
        $scope.loadTop = function () {
            $scope.step1open = true;
            console.log("Searching LoadTop");
            $scope.loadTopfacetObject = {
                "toUuids": {"terms": {"script_field": "doc['toUuid.uuid'].value"}},
                "fromUuids": { "terms": { "script_field": "doc['fromUuid.uuid'].value" } },
                "eventCodes": {"terms": { "field": "eventCode" } }
            };
            elasticService.facetSearch("now-1d/d", "now", currentUser.skynetuuid, 0, $scope.loadTopfacetObject, function (err, data) {
                if (err) {
                    return console.log(err);
                }
                console.log("Total Top Hits: " + data.hits.total);
                $scope.topResults = {
                    total: data.hits.total,
                    fromUuid: _.map(data.facets.fromUuids.terms, function (item) {
                        return {
                            label: item.term,
                            value: item.count
                        };
                    }),
                    toUuid: _.map(data.facets.toUuids.terms, function (item) {
                        return {
                            label: item.term,
                            value: item.count
                        };
                    }),
                    eventCodes: _.map(data.facets.eventCodes.terms, function (item) {
                        return {
                            label: item.term,
                            value: item.count
                        };
                    })
                }
            });
        };

        elasticService.getEvents("", function (data) {
            $scope.events = data;
        });

        // LOAD GRAPHS
        $scope.loadTop();

        //Checkbox Functions for Exploring list.
        $scope.selection = [];
        $scope.toggleSelection = function toggleSelection(fruitName) {
            var idx = $scope.selection.indexOf(fruitName);

            // is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }

            // is newly selected
            else {
                $scope.selection.push(fruitName);
            }
        };

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };


        // SETUP CHART
        // http://smoothiecharts.org/tutorial.html

        var line1 = new TimeSeries();
        var line2 = new TimeSeries();

        // setInterval(function() {
        //   line1.append(new Date().getTime(), Math.random()*100);
        //   line2.append(new Date().getTime(), Math.random()*100);
        // }, 1000);

        // Initialize up to 10 lines for charting
        var line = [];
        for (var i = 0; i < 10; i++) {
            line[i] = new TimeSeries();
        }

        // TODO: dynamically select better colors
        var smoothie = new SmoothieChart({ grid: { strokeStyle: 'rgb(125, 0, 0)', fillStyle: 'rgb(60, 0, 0)', lineWidth: 1, millisPerLine: 250, verticalSections: 6 } });
        // smoothie.addTimeSeries(line[1], { strokeStyle: 'rgb(0, 255, 0)', fillStyle: 'rgba(0, 255, 0, 0.4)', lineWidth: 3 });
        // smoothie.addTimeSeries(line[2], { strokeStyle: 'rgb(255, 0, 255)', fillStyle: 'rgba(255, 0, 255, 0.3)', lineWidth: 3 });
        for (var i = 0; i < 10; i++) {
            smoothie.addTimeSeries(line[i], { strokeStyle: 'rgb(0, ' + 255 + ', 0)', fillStyle: 'rgba(0, ' + 255 + ', 0, 0.4)', lineWidth: 3 });
        }

        smoothie.streamTo(document.getElementById("mycanvas"), 1000);


        var sensorGrid = [];


            $scope.sensorListen = function (sensor) {
                console.log('sensor listen', sensor);
                sensorGrid = [];
                        _.each(myDevices, function (device) {
                            socket.emit('unsubscribe', {
                                'uuid': device.uuid
                            }, function (data) {
                                //console.log(data);
                            });
                        });
                    // subscribe to new device selected for chart
                    socket.emit('subscribe', {
                        'uuid': sensor.uuid
                        // 'token': sensor.token
                    }, function (data) {
                        console.log(data);
                    });
            };

            socket.on('message', function (message) {
                // remove standard data from payload
                var sensorData = message.payload;
                console.log(sensorData);
                delete sensorData.uuid;
                delete sensorData.ipAddress;
                delete sensorData.api;

                for (var property in sensorData) {
                    if (sensorData.hasOwnProperty(property)) {
                        if (sensorGrid.indexOf(property) == -1) {
                            sensorGrid.push(property);
                        }
                        console.log('+' + sensorData[property] + '+');
                        $("#legend").html(JSON.stringify(sensorData));
                        if (sensorData[property] != undefined) {

                            for (var i in sensorGrid) {
                                if (property == sensorGrid[i]) {
                                    line[i].append(new Date().getTime(), sensorData[property] * 1);
                                }
                            }
                        }
                    }
                }
            });
        });
