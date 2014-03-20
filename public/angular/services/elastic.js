angular.module('e2eApp')
    // .config('elasticSearchConfig', {
    //   host: '54.213.111.71',
    //   port: '9200'
    // })
    .service('elasticService', function (esFactory) {
        console.log('in elastic service');
        var service = this;
        // this.config = elasticSearchConfig;
        this.client = esFactory({
            host: '54.213.111.71' + ':' + '9200'
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
