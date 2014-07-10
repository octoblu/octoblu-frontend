'use strict';

angular.module('octobluApp')
    .controller('analyzerController', function ($scope, $http, $injector, $log, elasticService, myDevices, currentUser) {
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
        elasticService.paramSearch({ "from": "now-1d/d", "to": "now", "size": 0, "query": "", "facet": {}, "aggs": {}}, $scope.devices, function (err, data) {
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
            $log.log("Ending: " + $scope.eGendDate + ", Starting: " + $scope.eGstartDate + ", EventCodes: " + $scope.eGEC + ", Selected Devices: " + $scope.eGselectDevices);
            $scope.legFirst = true;
            $scope.myAdditionalQuery = "";
            $scope.leg = {};
	    $scope.leg.config = { "contains_uuid" : "false", "contains_ec" : "false" };
            if ($scope.eGselectDevices && $scope.eGselectDevices.length > 0 ) {
                _.each($scope.eGselectDevices, function (key, value) {
                    $log.log(key);
                    if ($scope.legFirst && key != "all") {
                        $scope.leg.config.contains_uuid = "true";
                        $scope.myAdditionalQuery += " uuid=" + key + " ";
                        $scope.legFirst = false;
                    }
                    else if (key != "all") {
                        $scope.myAdditionalQuery += " OR uuid=" + key + " ";
                    }
                });

            }
            $scope.leg.facets = { "eventCodes": {"terms": { "field": "eventCode" } },
				'times': { 'date_histogram': { 'field': 'timestamp', 'interval': "hour"  }  },
				  "uuids": { "terms":{"field":"uuid"} }
				 };
	    $scope.leg.aggs = {
				"uuids" : {
            				"terms" : {
                				"field" : "uuid"
            				}
        			},
				"eventcodes" : {
					"terms" : {
						"field" : "eventCode"
					}
				},
				"count_by_uuid": {
         				"terms": {
            					"field": "uuid"
        				 },
         				"aggs": {
            				"events_by_date": {
               					"date_histogram": {
                  				"field": "timestamp",
                  				"interval": "hour"
               				},
               				"aggs": {
                  				"value_count_terms": {
                     					"value_count": {
                        					"field": "uuid"
                     					}
                  				}
					}
					}
					}
				}
			      };
            if ($scope.eGEC && $scope.eGEC != "all") {
               var oper = "";
                    $scope.leg.config.contains_ec = "true";
                    if ($scope.leg.config.contains_uuid == "true") { oper = " AND ( "; } 
		$scope.leg.firstEC = true;
                _.each($scope.eGEC, function (key, value) {
                    if ($scope.leg.firstEC) {
			$scope.leg.firstEC = false;
			$scope.myAdditionalQuery += oper + " eventCode=" + key;
		    } else {
                    	$scope.myAdditionalQuery += " OR eventCode=" + key;
                    }
                });
              if ($scope.leg.config.contains_uuid == "true") { $scope.myAdditionalQuery += " ) "; }
            }
            $scope.myAdditionalQuery += "";
	    $scope.myAQ = "";
	    if ($scope.myAdditionalQuery.length > 1) {$scope.myAQ = " ( " + $scope.myAdditionalQuery + " ) "; }
	    $log.log($scope.myAQ);
            elasticService.paramSearch({ "from":$scope.eGstartDate, "to":$scope.eGendDate, "size":0, "query":$scope.myAQ, "facet": $scope.leg.facets, "aggs": $scope.leg.aggs }, $scope.eGselectDevices, function (err, data) {
                if (err) {
                    return $log.log(err);
                }
                $log.log("function=loadExploreGraph callback");
                $log.log(data);
                $scope.leg = {"results": data, 
				"total": data.hits.total, 
				"dcEC": data.facets.eventCodes.terms.length, 
				"dcUUIDs" : data.facets.uuids.terms.length,
				"eventCounts": [ 
					{ key: "Event Count", 
					  values: _.map(data.facets.times.entries, function(item) {
						return { x: item.time, y: item.count };
					})
					}],
				"uuid_counts": [_.map(data.aggregations.count_by_uuid.buckets, function(item) {
							return { "key": item.key, "values": _.map(item.events_by_date, function(kitem){ 
								return { x: kitem.key, y: kitem.doc_count}; 
								})
							};
					       })
					       ]
			};
		$log.log($scope.leg);

            });

        };

        function search (currentPage) {
            $log.log("starting search function, analyzer controller");
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
            elasticService.paramSearch({"from":"now-1d/d", "to":"now", "size":0, "query":"", "facet": $scope.loadTopfacetObject, "aggs":{}}, $scope.devices, function (err, data) {
                if (err) {
                    return $log.log(err);
                }
                $log.log("Total Top Hits: " + data.hits.total);
                $scope.topResults = {
                    total: data.hits.total,
                    fromUuid: _.map(data.facets.fromUuids.terms, function (item) {
                        return {
                            label: $scope.deviceLookup[item.term] ? $scope.deviceLookup[item.term] : item.term,
                            value: item.count
                        };
                    }),
                    toUuid: _.map(data.facets.toUuids.terms, function (item) {
                        return {
                            label: $scope.deviceLookup[item.term] ? $scope.deviceLookup[item.term] : item.term,
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
