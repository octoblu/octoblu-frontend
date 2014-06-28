angular.module('octobluApp').
    service('PluginService', function ($q, $http,  skynetService) {

        this.getDefaultOptions = function (hub, pluginName) {
            return skynetService.gatewayConfig({
                "uuid": hub.uuid,
                "token": hub.token,
                "method": "getDefaultOptions",
                "name": pluginName
            });
        };

        this.getInstalledPlugins = function (hub) {
            skynetService.gatewayConfig({
                "uuid": hub.uuid,
                "token": hub.token,
                "method": "getPlugins"
            });
        };

        this.installPlugin = function (hub, pluginName) {
            return skynetService.gatewayConfig({
                "uuid": hub.uuid,
                "token": hub.token,
                "method": "installPlugin",
                "name": pluginName
            });
        };

        this.uninstallPlugin = function(hub, pluginName){
            return skynetService.gatewayConfig({
                "uuid": hub.uuid,
                "token": hub.token,
                "method": "uninstallPlugin",
                "name": pluginName
            });
        };

        this.getAvailablePlugins = function(){
            return $http.get('/api/device/plugins').then(function(result){
                return result.data;
            });
        }
    });

