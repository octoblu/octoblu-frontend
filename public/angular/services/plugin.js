angular.module('e2eApp').
    factory('PluginService' , function($cookies, $resource){
        return $resource('http://npmsearch.com/query?keywords=:keywords',
            {keywords : '@keywords'},
            {
                'skynetPlugins' :  { method : 'GET', isArray : true, params : {'keywords' : 'skynet-plugin'}}
            }
        );
    });

