'use strict';

angular.module('octobluApp')
    .controller('analyzerController',function ($rootScope, $scope, $http, $injector, $cookies, skynetConfig, elasticService, ownerService) {
        $rootScope.checkLogin($scope, $http, $injector, true, function () {
		$scope.debug_logging = true;
		$scope.log = function(logString) {
			if ($scope.debug_logging) { console.log(logString); }
		};
	
	    //Elastic Search Time Format Dropdowns
            $scope.ESdateFormats = elasticService.getDateFormats();

	    $scope.forms = {};
            // Get user devices
            $scope.log("getting devices from ownerService");
            ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function(data) {
		$scope.logic_devices = "";
                $scope.devices = data;
                $scope.deviceLookup = {};
                for (var i in $scope.devices) {
                    if($scope.devices[i].type == 'gateway'){
                        $scope.devices.splice(i,1);
                    }
		    if( !$scope.devices[i].name ) { $scope.devices[i].name = $scope.devices[i].uuid; }
		    $scope.logic_devices +=  $scope.devices[i].uuid + " OR ";
                    $scope.deviceLookup[$scope.devices[i].uuid] = $scope.devices[i].name;
                }
                //$scope.devices[$scope.devices.length] = { _id: "_all", name: "All Devices", "uuid": "*" };
		$scope.log("logging devices");
                $scope.log($scope.devices);
		$scope.log($scope.logic_devices);
            });
	    
	    $scope.setFormScope = function(scope){
 		  $scope.formScope = scope;
		  $scope.log("setting form scope to " + scope);
	    };

            $scope.currentPage = 1;

            $scope.$watch('currentPage', function(newValue, oldValue) {
              $scope.currentPage = newValue;
              $scope.search(newValue);
            });
	   
            $scope.$watch('devices', function(newValue, oldValue) {
		if (newValue) {
			$scope.log("New Value for Devices");
			elasticService.setOwnedDevices(newValue);
			elasticService.paramSearch("now-1d/d","now", 0, "", {},newValue, function(err,data){
                        	if (err) { return $scope.log(err); }
				$scope.log("function=paramSearch callback");
                        	$scope.log(data);
                	});
		    // LOAD GRAPHS
	            $scope.loadTop();


		}
	    });

		$scope.eGCharts = [];
    		$scope.eGCharts.push({      text: "Line"    });
    		$scope.eGCharts.push({	text: "Bar" });
	    
	$scope.loadExploreGraph = function() {
		$scope.eGstartDate = $scope.forms.EX_starting;
		$scope.eGendDate = $scope.forms.EX_ending;
		$scope.eGselectDevices = $scope.forms.EX_graphDevices;
		$scope.eGEC = $scope.forms.EX_eventCode;
		$scope.log($scope);
		$scope.log("Ending: "+ $scope.eGendDate + ", Starting: " +$scope.eGstartDate+ ", EventCodes: "+$scope.eGEC+", Selected Devices: " + $scope.eGselectDevices);
		$scope.legFirst = true;
		$scope.myAdditionalQuery =  " ( ";
		if ( $scope.eGselectDevices && $scope.eGselectDevices.length > 0 ){
			_.each($scope.eGselectDevices, function(key, value) {
				$scope.log(key);
				if ($scope.legFirst) { $scope.myAdditionalQuery += " uuid=" + key + " " ; $scope.legFirst = false; }
				else { $scope.myAdditionalQuery += " OR uuid="+ key + " "; }
			});
			
		}
		$scope.legFacets = { "eventCodes": {"terms": { "field": "eventCode" } }
				   };
		if ($scope.eGEC) { 
			_.each($scope.eGEC, function(key, value) {
				$scope.myAdditionalQuery += " AND eventCode=" + key; 
				}
		}
		$scope.myAdditionalQuery += " ) ";
		elasticService.paramSearch($scope.eGstartDate, $scope.eGendDate, 0, $scope.myAdditionalQuery, $scope.legFacets, $scope.eGselectDevices, function(err,data){
			if (err) { return $scope.log(err); }
                        $scope.log("function=loadExploreGraph callback");
                        $scope.log(data);
			$scope.leg = {"results":data, "total" : data.hits.total, "dcEC": data.facets.eventCodes.terms.length };
			
		});
		
	    };

            $scope.search = function (currentPage) {
              $scope.log("starting search function, analyzer controller");
              $scope.results="searching...";
	      $scope.log("searchText = "+ $scope.forms.FFsearchText);
                if ($scope.forms.FFsearchText !== undefined) {
                    elasticService.search($scope.devices, $scope.forms.FF_searchText, $scope.skynetuuid, currentPage, $scope.forms.FF_eventCode, function (error, response) {
                        if (error) {
                            $scope.log(error);
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

	    //Load Top Counts Panels On init of page
	$scope.loadTop = function(){
		$scope.step1open = true;
		$scope.log("Searching LoadTop");
                $scope.loadTopfacetObject = { 
			"toUuids": {"terms": {"script_field": "doc['toUuid.uuid'].value"}}, 
                        "fromUuids": { "terms": { "script_field": "doc['fromUuid.uuid'].value" } },
			"eventCodes": {"terms": { "field": "eventCode" } }
    		};
		elasticService.paramSearch("now-1d/d","now", 0, "", $scope.loadTopfacetObject, $scope.devices, function (err, data) {
                    if (err) { return $scope.log(err); }
		    $scope.log("Total Top Hits: " + data.hits.total);
		    $scope.topResults =	{
                        total: data.hits.total,
                        fromUuid: _.map(data.facets.fromUuids.terms, function (item) {
                            return {
                                label: item.term,
                                value: item.count
                            };
                        }),
		        toUuid: _.map(data.facets.toUuids.terms, function(item) {
			   return {
				label: item.term,
				value: item.count
			  };
			}),
			eventCodes: _.map(data.facets.eventCodes.terms, function(item) {
			  return {
				label: item.term,
				value: item.count
			  };
			})
                    }
                    });
		};

            elasticService.getEvents("", function(data) {
                $scope.events = data;
            });

            $scope.setPage = function (pageNo) {
              $scope.currentPage = pageNo;
            };

            var sensorGrid = [];

            skynetConfig.uuid = $scope.skynetuuid;
            skynetConfig.token = $scope.skynettoken;


            skynet(skynetConfig, function (e, socket) {
                if (e) throw e;

                $scope.sensorListen = function (sensor){
                  $scope.log('sensor listen', sensor);
                  sensorGrid = [];
                  // unsubscribe from other devices
                  ownerService.getDevices($scope.skynetuuid, $scope.skynettoken, function (data) {

                     // Subscribe to user's devices messages and events
                     if (data) {
                         _.each(data, function (device) {
                             socket.emit('unsubscribe', {
                                 'uuid': device.uuid
                             }, function (data) {
                                  //$scope.log(data);
                             });

                         });
                     }

                    // subscribe to new device selected for chart
                     socket.emit('subscribe', {
                         'uuid': sensor.uuid
                         // 'token': sensor.token
                     }, function (data) {
                          $scope.log(data);
                     });
                  });
            };
	 }); //end skynet call
        });
    });
