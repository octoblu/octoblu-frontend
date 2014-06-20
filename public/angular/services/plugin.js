angular.module('octobluApp').
    service('PluginService', function ($q, $http,  skynetService) {

        this.getDefaultOptions = function (hub, pluginName) {
            var defer = $q.defer();
            skynetService.gatewayConfig({
                "uuid": hub.uuid,
                "token": hub.token,
                "method": "getDefaultOptions",
                "name": pluginName
            }).then(function (defaults) {
                defer.resolve(defaults);
            });
            return defer.promise;
        };

        this.getInstalledPlugins = function (hub) {
            var defer = $q.defer();
            skynetService.gatewayConfig({
                "uuid": hub.uuid,
                "token": hub.token,
                "method": "getPlugins"
            }).then(function (defaults) {
                defer.resolve(defaults);
            });
            return defer.promise;

        };

        this.installPlugin = function (hub, pluginName) {
            var defer = $q.defer();
            return skynetService.gatewayConfig({
                "uuid": hub.uuid,
                "token": hub.token,
                "method": "installPlugin",
                "name": pluginName
            }).then(function (defaults) {
                defer.resolve(defaults);
            });
        };

        this.uninstallPlugin = function(hub, pluginName){
            var defer = $q.defer();
            return skynetService.gatewayConfig({
                "uuid": hub.uuid,
                "token": hub.token,
                "method": "uninstallPlugin",
                "name": pluginName
            }).then(function (defaults) {
                defer.resolve(defaults);
            });
        };
        /**
         *
         * @returns {*}
         */
        this.getAvailablePlugins = function(){
            return $http.get('/api/device/plugins').then(function(result){
                return result.data;
            });
        }
    });

