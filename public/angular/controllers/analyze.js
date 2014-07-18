'use strict';

angular.module('octobluApp')
    .controller('analyzeController', function ($scope, $http, $injector, $log, elasticService, myDevices, currentUser) {
        $scope.debug_logging = true;
        //Elastic Search Time Format Dropdowns
        $scope.ESdateFormats = elasticService.getDateFormats();

        $scope.forms = {};
        // Get user devices
        $log.log("getting devices from ownerService");

        $scope.devices = _.filter(myDevices, function (device) {
            return device.type !== 'gateway';
        });
        $scope.logic_devices = "";
        $scope.deviceLookup = {};
        _.each($scope.devices, function (device) {
            $scope.logic_devices += device.uuid + " OR ";
            $scope.deviceLookup[device.uuid] = device.name;
        });

        //$scope.devices[$scope.devices.length] = { _id: "_all", name: "All Devices", "uuid": "*" };
        $log.log("logging devices");
        $log.log($scope.devices);
        $log.log($scope.logic_devices);

        //Not sure what's going on here...but you probably should tackle it another way if you can.
        $scope.setFormScope = function (scope) {
            $scope.formScope = scope;
            $log.log("setting form scope to " + scope);
        };

        $scope.currentPage = 1;

        $scope.$watch('currentPage', function (newValue, oldValue) {
            //newvalue *is* the $scope.currentPage at this point already.
            //$scope.currentPage = newValue;
            search(newValue);
        });
        $log.log("New Value for Devices");
        elasticService.setOwnedDevices($scope.devices);
        elasticService.paramSearch("now-1d/d", "now", 0, "", {}, $scope.devices, function (err, data) {
            if (err) {
                return $log.log(err);
            }
            $log.log("function=paramSearch callback");
            $log.log(data);
        });
        // LOAD GRAPHS
        loadTop();


        $scope.eGCharts = [];
        $scope.eGCharts.push({      text: "Line"    });
        $scope.eGCharts.push({    text: "Bar" });

        $scope.loadExploreGraph = function () {
            $scope.eGstartDate = $scope.forms.EX_starting;
            $scope.eGendDate = $scope.forms.EX_ending;
            $scope.eGselectDevices = $scope.forms.EX_graphDevices;
            $scope.eGEC = $scope.forms.EX_eventCode;
            $log.log($scope);
            $log.log("Ending: " + $scope.eGendDate + ", Starting: " + $scope.eGstartDate + ", EventCodes: " + $scope.eGEC + ", Selected Devices: " + $scope.eGselectDevices);
            $scope.legFirst = true;
            $scope.myAdditionalQuery = " ( ";
            if ($scope.eGselectDevices && $scope.eGselectDevices.length > 0) {
                _.each($scope.eGselectDevices, function (key, value) {
                    $log.log(key);
                    if ($scope.legFirst) {
                        $scope.myAdditionalQuery += " uuid=" + key + " ";
                        $scope.legFirst = false;
                    }
                    else {
                        $scope.myAdditionalQuery += " OR uuid=" + key + " ";
                    }
                });

            }
            $scope.legFacets = { "eventCodes": {"terms": { "field": "eventCode" } }};

            if ($scope.eGEC) {
                _.each($scope.eGEC, function (key, value) {
                    $scope.myAdditionalQuery += " AND eventCode=" + key;
                });
            }
            $scope.myAdditionalQuery += " ) ";
            elasticService.paramSearch($scope.eGstartDate, $scope.eGendDate, 0, $scope.myAdditionalQuery, $scope.legFacets, $scope.eGselectDevices, function (err, data) {
                if (err) {
                    return $log.log(err);
                }
                $log.log("function=loadExploreGraph callback");
                $log.log(data);
                $scope.leg = {"results": data, "total": data.hits.total, "dcEC": data.facets.eventCodes.terms.length };

            });

        };

        function search (currentPage) {
            $log.log("starting search function, analyze controller");
            $scope.results = "searching...";
            $log.log("searchText = " + $scope.forms.FFsearchText);
            if ($scope.forms.FFsearchText !== undefined) {
                elasticService.search($scope.devices, $scope.forms.FF_searchText, currentUser.skynetuuid, currentPage, $scope.forms.FF_eventCode, function (error, response) {
                    if (error) {
                        $log.log(error);
                    } else {
                        $scope.results = response;
                        $scope.totalItems = response.hits.total;
                        $scope.maxSize = 10;

                    }
                });

            } else {
                $scope.results = "";
            }
        }

        //Load Top Counts Panels On init of page
        function loadTop() {
            $scope.step1open = true;
            $log.log("Searching LoadTop");
            $scope.loadTopfacetObject = {
                "toUuids": {"terms": {"script_field": "doc['toUuid.uuid'].value"}},
                "fromUuids": { "terms": { "script_field": "doc['fromUuid.uuid'].value" } },
                "eventCodes": {"terms": { "field": "eventCode" } }
            };
            elasticService.paramSearch("now-1d/d", "now", 0, "", $scope.loadTopfacetObject, $scope.devices, function (err, data) {
                if (err) {
                    return $log.log(err);
                }
                $log.log("Total Top Hits: " + data.hits.total);
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

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        var sensorGrid = [];

        $scope.sensorListen = function (sensor) {
            $log.log('sensor listen', sensor);
            sensorGrid = [];
        };
    });
