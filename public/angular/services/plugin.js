angular.module('octobluApp').
    service('PluginService' , function($q, $rootScope, skynetConfig){

        this.getDefaultOptions = function(hub, pluginName){
            var defer = $q.defer();
            $rootScope.skynetSocket.emit('gatewayConfig', {
                "uuid": hub.uuid,
                "token": hub.token,
                "method": "getDefaultOptions",
                "name": pluginName
            }, function (defaults) {
                defer.resolve(defaults);
            });
            return defer.promise;
        };

        this.getAllPlugins = function(hub){
            var defer = $q.defer();
            $rootScope.skynetSocket.emit('gatewayConfig', {
                "uuid": hub.uuid,
                "token": hub.token,
                "method": "getPlugins"
            }, function (defaults) {
                defer.resolve(defaults);
            });
            return defer.promise;

        };

        this.installPlugin = function(hub, pluginName){
            var defer = $q.defer();
            $rootScope.skynetSocket.emit('gatewayConfig', {
                "uuid": hub.uuid,
                "token": hub.token,
                "method": "installPlugin",
                "name" : pluginName
            }, function (defaults) {
                defer.resolve(defaults);
            });
            return defer.promise;

        }

    });

