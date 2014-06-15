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

        this.searchAdvanced = function (queryObject, ownerUuid, page, eventCode, callback) {
            fromPage = (page * 10) / 10;
            console.log("Advanced Search");
            console.log(queryObject);
            eC = "";
            if (eventCode){
		eC = ', _type:' + eventCode;
	    }
            console.log(ownerUuid);
            service.client.search({
                index: '_all',
                size: 10,
                from: fromPage,
                body: {
  "query": {
    "query_string": {
      "default_field": "_all",
      "query": queryObject + ", owner:"+ownerUuid + eC
    }
  }
}
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
