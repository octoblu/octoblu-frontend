angular.module('octobluApp')
    .constant('elasticSearchConfig', {
       host: '54.187.66.141',
	//host: 'localhost',
       port: '9200',
       es_index: 'skynet_trans_log',
       debug_logging: true
    })
    .service('elasticService', function (elasticSearchConfig, esFactory, $http) {
        var service = this;
        this.config = elasticSearchConfig;
        this.client = esFactory({
            host: elasticSearchConfig.host + ':' + elasticSearchConfig.port
        });
	
	this.log = function(log_string) {
		if(this.config.debug_logging) { console.log(log_string); }
	};

	this.buildDevices = function(myDevices) {
		first = true;
                deviceString = "";
                _.each(myDevices, function(data){
                        if (first && data.uuid) { first = false; deviceString += " uuid="+data.uuid; }
                        else if (data.uuid) { deviceString += " OR uuid="+data.uuid;  }
                });
		return deviceString;
	};

	this.setOwnedDevices = function(myDevices){
		this.devices = { "object": myDevices, "logic": this.buildDevices(myDevices) };
	};

	this.getDateFormats = function(){
		return { 
			"now": { "text": "Now", "value": "now", "esel": "selected=selected" },
			"yesterday": {"text": "Yesterday", "value": "now-1d/d"},
			"4_hours_ago": { "text": "4 Hours Ago", "value":"now-4h/h"},
			"12_hours_ago" : { "text": "12 Hours Ago", "value":"now-12h/h" },
			"24_hours_ago" : { "text": "24 Hours Ago", "value":"now-24h/h" },
			"this_week" : { "text": "Week to date", "value" : "now-1w/w" },
			"30_days" : {"text" : "30 Days Ago", "value" : "now-30d/d", "ssel":"selected=selected"}
		};
	};

        this.search = function (myDevices,queryText, ownerUuid, page, eventCode, callback) {
	    this.log('starting function=search');
            fromPage = (page * 10) / 10;
	    eCode = "";
            if(eventCode){
              eCode = ' , _type:' + eventCode;
            }
	    this.log(queryText);
            secondaryString = queryText + ', owner:' + ownerUuid + eCode;
            this.log(secondaryString);
            service.client.search({
                index: elasticSearchConfig.es_index,
                size: 1,
                q: queryText
            }, function (error, response) {
                callback(error, response);
            });
        };

	this.paramSearch = function (pConfig, myDevices, callback) {
		this.log("starting function=paramSearch");
		myQuery = "";
		if (pConfig.query.length > 0) { myQuery = " AND " + pConfig.query; }
		
		baseSearchObject = {"size":pConfig.size,"query": {"filtered": {"filter": {"query": {"bool": {"must": [{"query_string": {"query": "('"+this.devices.logic+"') "+myQuery }},{"range": {"timestamp": {"from": pConfig.from,"to": pConfig.to}}}]}}}}},"facets": pConfig.facet, "aggs": pConfig.aggs};
		if (pConfig.size < 1) { delete baseSearchObject.size; }
		this.log(JSON.stringify(baseSearchObject));
		service.client.search({ index: elasticSearchConfig.es_index, body: baseSearchObject}, function(error,response) { callback(error, response); });
	}; 

        this.facetSearch = function (from, to, ownerUuid, size, facet, callback) {
            this.log("starting function=facetSearch");
            this.log(ownerUuid);
            baseSearchObject = {"size":size,"query": {"filtered": {"filter": {"query": {"bool": {"must": [{"query_string": {"query": "(fromUuid.owner = '"+ownerUuid+"' OR toUuid.owner = '"+ownerUuid+"')"}},{"range": {"timestamp": {"from": from,"to": to}}}]}}}}},"facets": facet};
	    this.log(baseSearchObject);
            service.client.search({
                index: elasticSearchConfig.es_index,
                body: baseSearchObject
            }, function (error, response) {
                callback(error, response);
            });

	};
	this.searchAdvanced = function (queryObject, callback) {
            this.log(queryObject);
            service.client.search({
                index: elasticSearchConfig.es_index,
                body: queryObject
            }, function (error, response) {
                callback(error, response);
            });
        };

        this.getEvents = function(test, callback) {

            $http.get('/api/events/')
                .success(function(data) {
                  // this.log(data);
                    callback(data);
                })
                .error(function(data) {
                    this.log('Error: ' + data);
                    callback({});
                });

        };

    });
