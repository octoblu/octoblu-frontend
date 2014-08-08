'use strict';

angular.module('octobluApp')
    .filter('freeFormDisplayText', function() {
        return function(text) {
            return angular.isObject(text) ? 'Object' : text;
        };
    })
//    .controller('analyzeController', function ($scope, $http, $injector, $log, elasticService, currentUser, myDevices) {
    .controller('analyzeController', function ($rootScope, $scope, $http, $injector, $location, $log,
                                               elasticService, channelService, userService, currentUser, myDevices) {
        $scope.debug_logging = true;

        if (!Number.prototype.formatCommas){
            Number.prototype.formatCommas = function(){
                return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        }
        //Elastic Search Time Format Dropdowns
        $scope.ESdateFormats = elasticService.getDateFormats();
	$scope.EStimeModifiers = [ { value:"second", text:"Second"},
				   { value:"minute",text:"Minute"},
				   { value:"day", text:"Day"},
                                   { value:"week", text:"Week"},
                                   { value:"month", text:"Month"}
				 ];

        $scope.forms = {};
	$scope.ExploreIsCollapsed = false;
        // Get user devices

        $log.log("currentUser");
        $log.log(currentUser);
        $log.log("getting devices from ownerService");
        $log.log(myDevices);

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

        $scope.currentPage = 0;

        $log.log("New Value for Devices");
        elasticService.setOwnedDevices($scope.devices);
        /// FUNCTIONS

        $scope.eGCharts = [];
        $scope.eGCharts.push({      text: "Line"    });
        $scope.eGCharts.push({    text: "Bar" });

	$scope.leg = {};
        $scope.loadExploreGraph = function () {
            $scope.eGstartDate = $scope.forms.EX_starting;
            $scope.eGendDate = $scope.forms.EX_ending;
            $scope.eGselectDevices = $scope.forms.EX_graphDevices;
            $scope.eGEC = $scope.forms.EX_eventCode;
            $log.log("Ending: " + $scope.eGendDate + ", Starting: " + $scope.eGstartDate + ", EventCodes: " + $scope.eGEC + ", Selected Devices: " + $scope.eGselectDevices);
            $scope.legFirst = true;
            $scope.myAdditionalQuery = "";
            if (!$scope.eGendDate) { $scope.eGendDate = "now"; }
            if (!$scope.eGstartDate) { $scope.eGstartDate = "now-30d/d"; }
            $scope.leg.config = { "contains_uuid" : "false", "contains_ec" : "false" };
            if ($scope.eGselectDevices && $scope.eGselectDevices.length > 0 ) {
                _.each($scope.eGselectDevices, function (key, value) {
                    $log.log(key);
                    if ($scope.legFirst && key != "all") {
                        $scope.leg.config.contains_uuid = "true";
                        $scope.myAdditionalQuery += " _type:" + key + " ";
                        $scope.legFirst = false;
                    }
                    else if (key != "all") {
                        $scope.myAdditionalQuery += " OR _type:" + key + " ";
                    }
                });

            }
	    $scope.leg.myInterval = $scope.forms.EX_aggby;
	    if ($scope.leg.myInterval == undefined) { $scope.leg.myInterval = "hour"; }
            $scope.leg.facets = { "eventCodes": {"terms": { "field": "eventCode" } },
                'times': { 'date_histogram': { 'field': 'timestamp', 'interval': $scope.leg.myInterval  }  },
                "uuids": { "terms":{"field":"_type"} }
            };
            $scope.leg.aggs = {
                "uuids" : {
                    "terms" : {
                        "field" : "_type"
                    }
                },
                "eventcodes" : {
                    "terms" : {
                        "field" : "eventCode"
                    }
                },
		"events_by_uuid" : {
      			"terms": { "field": "_type"},
      			"aggs" : {
          			"count_terms": {
            				"terms": { "field":"eventCode" }
         			}
      			}
    		},
		"uuid_by_events": { "terms": { "field":"eventCode"}, "aggs": {"count_terms": { "terms":{"field":"_type"}}} },
                "count_by_uuid": {
                    "terms": {
                        "field": "_type"
                    },
                    "aggs": {
                        "events_by_date": {
                            "date_histogram": {
                                "field": "timestamp",
                                "interval": $scope.leg.myInterval
                            },
                            "aggs": {
                                "value_count_terms": {
                                    "value_count": {
                                        "field": "_type"
                                    }
                                },
				"count_terms": {
					"terms": {
						"field":"eventCode"
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
                $scope.legCounter = 0;
                _.each(data.aggregations.count_by_uuid.buckets, function(key, val) {
                    $log.log("each Aggregate");
                });
                var tmpAggro = _.each(data.aggregations.count_by_uuid.buckets,function(key, val){
                    return {  "key": key.key, "values": _.map(key.events_by_date.buckets, function(item){
                        return { x: item.key, y: item.value_count_terms.value };
                    })
                    };
                });
		var stackedDomain = [];
		var myTmpInterval = $scope.leg.myInterval;
                $scope.leg = {"results": data,
                    "total": data.hits.total,
		    "myInterval": myTmpInterval,
                    "dcEC": data.facets.eventCodes.terms.length,
                    "dcUUIDs" : data.facets.uuids.terms.length,
                    "eventCounts": [
                        { key: "Event Count",
                            values: _.map(data.facets.times.entries, function(item) {
                                return { x: item.time, y: item.count };
                            })
                        }],
                    "uuid_counts": _.map(data.aggregations.count_by_uuid.buckets,function(key){
                        return {  "key": ( $scope.deviceLookup[key.key] ? $scope.deviceLookup[key.key] : key.key), "values": _.map(key.events_by_date.buckets, function(item){
                            return { x: item.key, y: item.value_count_terms.value };
                        })
                        };
                    }),
 		    "scatter_events_devices" : _.map(data.aggregations.events_by_uuid.buckets, function(key) {
			return { "key": ($scope.deviceLookup[key.key] ? $scope.deviceLookup[key.key] : key.key),
				"values": _.map(key.count_terms.buckets, function(item) {
					return { item:item, x: item.key, size: item.doc_count, y: key.key };
				})
			};
		    }),
		    "stacked": { "domain":[], "data": _.map(data.aggregations.events_by_uuid.buckets, function(key) {
			return { "key": ($scope.deviceLookup[key.key] ? $scope.deviceLookup[key.key] : key.key), 
				 "values": _.map(key.count_terms.buckets, function(item){
					stackedDomain.push(item.key);
					return { size: item.doc_count, series: key.key, x: item.key, y: item.doc_count };
				})
			};
		    })},
                    "scatter": _.map(data.aggregations.count_by_uuid.buckets, function(key) {
                        return { "key": ($scope.deviceLookup[key.key] ? $scope.deviceLookup[key.key] : key.key),
                            "values": _.map(key.events_by_date.buckets, function(item){	
                                return { item: item, x: item.key, size: item.value_count_terms.value, y: item.count_terms.buckets[0].key } })
                        };
                    })

                };
		$scope.leg.stacked.domain = stackedDomain;
		$scope.leg.panels = { "ecot" : { "title": "Event Counts over Time", "isCollapsed" :false, "data" : $scope.leg.uuid_counts },
				      "ec_by_uuid" : { "title" : "Count of Event Codes by Device", "isCollapsed":false, "data" :$scope.leg.stacked.data }
		};
		/*$scope.leg.panels.push({ "title" : "Event Counts Over Time",
                  			 "graph": "nvd3-line-with-focus-chart",
                  			 "graph_options" : 'show-legend="True" axis-x-label="'+$scope.leg.myInterval+'" axis-x-type="date" axis-x-format="%-m/%-d %H:%M"',
					 "data": $scope.leg.uuid_counts
                });*/
		$log.log("leg object");
                $log.log($scope.leg);
            });
        };

        $scope.sort = "=", $scope.order = '='; $scope.itemsPerPage = 10;
        $scope.sort_by = function(newSortingOrder) {
            var sort = $scope.sort;

            if (sort.sortingOrder == newSortingOrder){
                sort.reverse = !sort.reverse;
            }

            sort.sortingOrder = newSortingOrder;
        };


        $scope.selectedCls = function(column) {
            if(column == $scope.sort.sortingOrder){
                return ('icon-chevron-' + (($scope.sort.reverse) ? 'down' : 'up'));
            }
            else{
                return'icon-sort'
            }
        };

        // calculate page in place
        $scope.groupToPages = function () {
            $scope.freeform_results_ngTable.pagedItems = [];
            $log.log("groupToPages");
            $log.log($scope.freeform_results);
            for (var i = 0; i < $scope.freeform_results.length; i++) {
                if (i % $scope.itemsPerPage === 0) {
                    $scope.freeform_results_ngTable.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [ $scope.freeform_results[i] ];
                } else {
                    $scope.freeform_results_ngTable.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.freeform_results[i]);
                }
            }
        };

        $scope.gap = 1;
        $scope.range = function (size,start, end, gap) {
            var ret = [];
            console.log(size,start, end);
            if (size < end) {
                end = size;
                start = size-gap;
            }
            for (var i = start; i < end; i++) {
                ret.push(i);
            }
            console.log(ret);
            return ret;
        };

        $scope.prevPage = function () {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
            }
        };

        $scope.nextPage = function () {
            if ($scope.currentPage < $scope.freeform_results_ngTable.pagedItems.length - 1) {
                $scope.currentPage++;
            }
        };

        $scope.setPage = function () {
            $scope.currentPage = this.n;
        };


        $scope.search = function() {
            $scope.ff = {};
            $log.log("starting search function, analyzer controller");
            $scope.results = [ { "text":"searching..." } ];
            $log.log("searchText = " + $scope.forms.FF_searchText);
            if ($scope.forms.FF_searchText !== undefined) {
        	var query = " ( " + $scope.forms.FF_searchText;
                if ($scope.forms.FF_eventCode !== undefined && $scope.forms.FF_eventCode > 0) {
                        query += " AND eventCode:"+$scope.forms.FF_eventCode;
                }
		query += " )";
                elasticService.paramSearch({ "from":"now-90d/d", "to": "now", "size":1000, "query": query, "facet": {}, "aggs": {}}, $scope.devices, function (error, response) {
                    if (error) {
                        $log.log(error);
                    } else {
                        $log.log("Found stuff");
                        $log.log("response follows");
                        $log.log(response);
                        $log.log(currentUser);
                        $scope.freeform_results = response.hits.hits;
                        var tmp_head = {};
                        for ( var item in $scope.freeform_results ) {
                            for (var prop in $scope.freeform_results[item]._source) {
                                tmp_head[prop] = "exist";
                            }
                        }
                        $log.log(tmp_head);
                        var headers = [];
                        var excludeList = [ "auth", "fromUuid", "toUuid", "subdevices", "plugins", "token" ];
                        for (var name in tmp_head) {
                            if ( _.contains(excludeList, name) ) { $log.log("excluding " + name); }
                            else {
                                headers.push({"name":name});
                            }
                        }
//			$scope.freeform_results_ngTable = { "headers": [{"name": "uuid"}, {"name":"protocol"}, {"name":"ipAddress"},{"name":"eventCode"},{"name": "timestamp"}, {"name":"channel"},{"name":"online"},{"name":"name"} ]};
                        $scope.freeform_results_ngTable = { "headers": headers };
			$scope.currentPage = 0;
			$scope.totalItems = response.hits.total;
                        $scope.groupToPages();
                        $scope.results = response;
                        $scope.ff.maxSize = 10;

                    }
                });

            } else {
                $scope.results = "None Found";
                $log.log("no search term");
            }

        };
	/*
        function searchNewValue () {
            $log.log("starting search function, analyzer controller");
            $scope.results = [ { "text":"searching..." } ];
            $log.log("searchText = " + $scope.forms.FF_searchText);
	   
            if ($scope.forms.FF_searchText !== undefined) {
		var query = $scope.forms.FF_searchText;
		if ($scope.forms.forms.FF_eventCode !== undefined) {
			query += " eventCode:"+$scope.forms.FF_eventCode;
		}
                elasticService.search($scope.devices, $scope.forms.FF_searchText, currentUser.skynetuuid, currentPage, $scope.forms.FF_eventCode, function (error, response) {
                    if (error) {
                        $log.log(error);
                    } else {
                        $scope.freeform_results = response.hits.hits;
                        $scope.results = response;
                        $scope.totalItems = response.hits.total;
                        $scope.maxSize = 10;

                    }
                });

            } else {
                $scope.results = "";
            }
        }*/

        //Load Top Counts Panels On init of page
        $scope.loadTop = function(usageFrom) {
            $log.log("starting from " + usageFrom);
            $scope.step1open = true;
            $log.log("Searching LoadTop");
            $scope.loadTopfacetObject = {
                "toUuids": {"terms": {"script_field": "doc['toUuid.uuid'].value", "size": 5 }},
                "fromUuids": { "terms": { "script_field": "doc['fromUuid.uuid'].value" , "size":5 }},
                "eventCodes": {"terms": { "field": "eventCode" } }
            };
            $scope.loadTopAggObject = {
                "distCountDevice":  {"cardinality": { "field": "uuid"} },
                "distCountChannels" : {"cardinality": {"field":"channel"}},
                "distCountToDevice": { "cardinality": {"field":"toUuid.uuid"}},
                "distCountFromDevice": {"cardinality" : {"field":"fromUuid.uuid"}}
            };
            elasticService.paramSearch({"from":usageFrom, "to":"now", "size":0, "query":"", "facet": $scope.loadTopfacetObject, "aggs":$scope.loadTopAggObject }, $scope.devices, function (err, data) {
                if (err) {
                    return $log.log(err);
                }
                $log.log("Total Top Hits: " + data.hits.total);
                $log.log(data.aggregations);
                $scope.topResults = {
                    total: data.hits.total,
                    "rows": [ [ { "title": "Total Messages", "results": data.hits.total.formatCommas() },
                        { "title": "Average Messages Per Day", "results": Math.round(data.hits.total / 30).formatCommas() },
                        { "title": "Average Messages Per Hour", "results": Math.round(data.hits.total / (30 * 24)).formatCommas() },
                    ],[
                        { "title": "Number of Channels", "results": data.aggregations.distCountChannels.value },
                        { "title": "Number of Devices", "results": data.aggregations.distCountDevice.value },
                        { "title": "Distinct Devices sent from", "results": data.aggregations.distCountFromDevice.value },
                        { "title": "Distinct Devices sent to", "results": data.aggregations.distCountToDevice.value }
                    ]
                    ],
                    "pie_panels": [
                        { "id": "topEC", "title" : "Top Event Codes", "results": _.map(data.facets.eventCodes.terms, function (item) {
                            return {
                                label: item.term,
                                value: item.count
                            };
                        })},
                        { "id": "topDS","title": "Top "+data.facets.fromUuids.terms.length+" Devices Sending", "results": _.map(data.facets.fromUuids.terms, function (item) {
                            return {
                                label: $scope.deviceLookup[item.term] ? $scope.deviceLookup[item.term] : item.term,
                                value: item.count
                            };
                        })},
                        { "id": "topDR", "title": "Top "+data.facets.fromUuids.terms.length+" Devices Receiving", "results": _.map(data.facets.toUuids.terms, function (item) {
                            return {
                                label: $scope.deviceLookup[item.term] ? $scope.deviceLookup[item.term] : item.term,
                                value: item.count
                            };
                        })}
                    ]
                }
            });
        };

        elasticService.getEvents("", function (data) {
            $scope.events = data;
        });

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        // LOAD GRAPHS
	$scope.loadTop("now-30d/d");

        var sensorGrid = [];

        $scope.sensorListen = function (sensor) {
            $log.log('sensor listen', sensor);
            sensorGrid = [];
        };
    });
