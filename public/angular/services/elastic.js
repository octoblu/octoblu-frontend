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

// name:"home", owner:"5d6e9c91-820e-11e3-a399-f5b85b6b9fd0"
// "owner" : ownerUuid
                // "term" : { "owner" : ownerUuid }

                // "term" : { "owner" : ownerUuid },
                // // q: queryText,
                // "query_string" : {
                //     // "owner" : ownerUuid,
                //     "query" : queryText
                // }

                // "query": {
                //     "query_string": {
                //         "query": queryText
                //     },
                //     "term": {
                //         "owner" : ownerUuid
                //     }
                // }

            }, function (error, response) {
                callback(error, response);
            });
        };
    });
