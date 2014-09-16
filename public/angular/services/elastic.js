angular.module('octobluApp')
.service('elasticSearchConfig', function($location){
    return {
        protocol: $location.protocol(),
        host: $location.host(),
        port: $location.port(),
        path: '/api/elastic',
	//path: '',
        //host: 'es.octoblu.com',
	//port: 80,
        es_index: 'skynet_trans_log',
        debug_logging: true
    };
})
.service('elasticService', function (elasticSearchConfig, esFactory, $http) {
    var service = this;
    this.config = elasticSearchConfig;
    this.client = esFactory({
        host: this.config.protocol + '://' + this.config.host + ':' + this.config.port + this.config.path
    });

    this.buildDevices = function(myDevices) {
        var _this = this;

        _this.first = true;
        var deviceString = "";
        _.each(myDevices, function(data){
            if (_this.first && data.uuid) {
                _this.first = false;
                deviceString += " _type:" + data.uuid;
            }
            else if (data.uuid) { deviceString += " OR _type:"+data.uuid;  }
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
            "30_days" : {"text" : "30 Days Ago", "value" : "now-30d/d", "ssel":"selected=selected"},
	    "1_month" : {"text" : "1 Month Ago", "value" : "now-1M/M" },
	    "6_month" : {"text" : "6 Months Ago", "value" : "now-6M/M" }
        };
    };

    this.search = function (myDevices, queryText, ownerUuid, page, eventCode, callback) {
        var fromPage = (page * 10) / 10;
        var eCode = "";
        if(eventCode){
          eCode = ' , _type:' + eventCode;
        }
        var secondaryString = queryText + ', owner:' + ownerUuid + eCode;
        service.client.search({
            index: elasticSearchConfig.es_index,
            size: 1,
            q: queryText
        }, function (error, response) {
            callback(error, response);
        });
    };

    this.paramSearch = function (pConfig, myDevices, callback) {
        var myQuery = "";
        if (pConfig.query.length > 0) { myQuery = " AND " + pConfig.query; }

        var baseSearchObject = {"size":pConfig.size,"query": {"filtered": {"filter": {"query": {"bool": {"must": [{"query_string": {"query": "('"+this.devices.logic+"') "+myQuery }},{"range": {"timestamp": {"from": pConfig.from,"to": pConfig.to}}}]}}}}},"facets": pConfig.facet, "aggs": pConfig.aggs};
        if (pConfig.size < 1) { delete baseSearchObject.size; }
        service.client.search({ index: elasticSearchConfig.es_index, body: baseSearchObject}, function(error,response) { callback(error, response); });
    };

    this.facetSearch = function (from, to, ownerUuid, size, facet, callback) {
        var baseSearchObject = {"size":size,"query": {"filtered": {"filter": {"query": {"bool": {"must": [{"query_string": {"query": "(fromUuid.owner = '"+ownerUuid+"' OR toUuid.owner = '"+ownerUuid+"')"}},{"range": {"timestamp": {"from": from,"to": to}}}]}}}}},"facets": facet};
        service.client.search({
            index: elasticSearchConfig.es_index,
            body: baseSearchObject
        }, function (error, response) {
            callback(error, response);
        });
    };

    this.searchAdvanced = function (queryObject, callback) {
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
            callback(data);
        })
        .error(function(data) {
            callback({});
        });
    };
});
