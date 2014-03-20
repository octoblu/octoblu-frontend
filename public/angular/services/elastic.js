angular.module('e2eApp')
    .constant('elasticSearchConfig', {
       host: '54.213.111.71',
       port: '9200'
    })
    .service('elasticService', function (elasticSearchConfig, esFactory) {
        console.log('in elastic service');
        var service = this;
        this.config = elasticSearchConfig;
        this.client = esFactory({
            host: elasticSearchConfig.host + ':' + elasticSearchConfig.port
        });

        this.search = function (queryText, callback) {
            service.client.search({
                q: queryText,
                index: '_all'
            }, function (error, response) {
                callback(error, response);
            });
        };
    });
