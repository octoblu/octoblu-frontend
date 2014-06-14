angular.module('octobluApp').
    service('PluginService', function ($q, skynetService) {

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

        this.getAllPlugins = function (hub) {
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
            return skynetService.gatewayConfig({
                "uuid": hub.uuid,
                "token": hub.token,
                "method": "installPlugin",
                "name": pluginName
            }).then(function (defaults) {
                defer.resolve(defaults);
            });
        }
    });

