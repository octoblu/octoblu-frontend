angular.module('e2eApp')
    .constant('elasticSearchConfig', {
       host: '54.213.111.71',
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
            service.client.search({
                index: '_all',
                size: 10,
                from: fromPage,
                q: queryText + ', owner:' + ownerUuid + eventCode
                // q: 'type:drone AND owner:' + ownerUuid
                // q: queryText + ' AND uuid:' + ownerUuid
                // q: queryText

            }, function (error, response) {
                callback(error, response);
            });
        };

        this.searchAdvanced = function (queryObject, callback) {
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
