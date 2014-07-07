'use strict';

angular.module('octobluApp')
    .controller('analyzerController', function ($scope, $http, $injector, skynetConfig, elasticService, myDevices, currentUser) {
        // Get user devices
        $scope.devices = _.filter(myDevices, function (device) {
            return device.type !== 'gateway';
        });

        $scope.splunk_devices = "";
        $scope.deviceLookup = {};
        _.each($scope.devices, function (device) {
            $scope.splunk_devices += device.uuid + " OR ";
            $scope.deviceLookup[device.uuid] = device.name;
            console.log($scope.devices);
            console.log($scope.splunk_devices);
        });
        $scope.devices.push({ _id: "_all", name: "All Devices" });

        $scope.currentPage = 1;

        $scope.$watch('currentPage', function (newValue, oldValue) {
            $scope.currentPage = newValue;
            $scope.search(newValue);
        });

        $scope.search = function (currentPage) {
            $scope.results = "searching...";
            if ($scope.searchText !== undefined) {
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
    });
