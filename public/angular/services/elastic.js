angular.module('e2eApp')
    .constant('elasticSearchConfig', {
       host: '54.213.111.71',
       port: '9200'
    })
    .service('elasticService', function (elasticSearchConfig, esFactory) {
        var service = this;
        this.config = elasticSearchConfig;
        this.client = esFactory({
            host: elasticSearchConfig.host + ':' + elasticSearchConfig.port
        });

        this.search = function (queryText, ownerUuid, callback) {
            service.client.search({
                index: '_all',
                size: 10,
                q: queryText + ', owner,' + ownerUuid

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
    });
