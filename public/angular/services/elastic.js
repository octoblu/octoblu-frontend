angular.module('octobluApp')
    .constant('elasticSearchConfig', {
       host: '54.187.66.141',
       port: '9200'
    })
    .service('elasticService', function (elasticSearchConfig, esFactory, $http) {
        var service = this;
        this.config = elasticSearchConfig;
        this.client = esFactory({
            host: elasticSearchConfig.host + ':' + elasticSearchConfig.port
        });
	
        this.search = function (queryText, ownerUuid, page, eventCode, callback) {
            fromPage = (page * 10) / 10;
            if(eventCode){
              eventCode = ' , _type:' + eventCode;
            }
	    console.log(queryText);
            secondaryString = queryText + ', owner:' + ownerUuid + eventCode;
            console.log(secondaryString);
            service.client.search({
                index: '_all',
                size: 10,
                from: fromPage,
                q: queryText
            }, function (error, response) {
                callback(error, response);
            });
        };

/*                body: {
  "query": {
    "query_string": {
      "default_field": "_all",
      "query": queryObject + ", owner:"+ownerUuid + eC
    }
  }}*/

        this.facetSearch = function (from, to, ownerUuid, size, facet, callback) {
            console.log("Time Advanced Search");
            console.log(ownerUuid);
            baseSearchObject = {"size":size,"query": {"filtered": {"filter": {"query": {"bool": {"must": [{"query_string": {"query": "(fromUuid.owner = '"+ownerUuid+"' OR toUuid.owner = '"+ownerUuid+"')"}},{"range": {"timestamp": {"from": from,"to": to}}}]}}}}},"facets": facet};
	    console.log(baseSearchObject);
            service.client.search({
                index: '_all',
                body: baseSearchObject
            }, function (error, response) {
                callback(error, response);
            });

	};
	this.searchAdvanced = function (queryObject, callback) {
            console.log(queryObject);
            service.client.search({
                index: '_all',
                body: queryObject
            }, function (error, response) {
                callback(error, response);
            });
        };

        this.getEvents = function(test, callback) {

            $http.get('/api/events/')
                .success(function(data) {
                  // console.log(data);
                    callback(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                    callback({});
                });

        };

    });
