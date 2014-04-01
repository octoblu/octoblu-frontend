angular.module('e2eApp').
    factory('PluginService' , function($cookies, $resource){
        // http://npmsearch.com/query?fl=name,description,homepage&rows=200&sort=rating+desc&q=%22skynet-plugin%22
        return $resource('http://npmsearch.com/query?fl=:fl&rows=:rows&sort=:sort&q=:q',
        {
                'q': 'keywords:"skynet-plugin"',
                'fields': 'name',
                'start': 0,
                'size': 100,
                'sort': 'rating:desc'
        },
            {
                'skynetPlugins' :  { method : 'GET', isArray : false, params : {'keywords' : 'skynet-plugin'}}
            }
        );
    });

