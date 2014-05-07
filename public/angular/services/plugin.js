angular.module('octobluApp').
    factory('PluginService' , function($cookies, $resource){
        return $resource('http://npmsearch.com/query',
          null,
            {
                'skynetPlugins' :
                {
                    method : 'GET',
                    params :
                    {
                        q: 'keywords:"skynet-plugin"',
                        fields: 'name',
                        start: 0,
                        size: 100,
                        sort: 'rating:desc'
                    },
                    isArray : false
                }
            }
        );
    });

