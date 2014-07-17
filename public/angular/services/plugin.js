angular.module('octobluApp').
    service('PluginService', function ($q, $http,  deviceService) {

        this.getDefaultOptions = function (hub, pluginName) {
            return deviceService.gatewayConfig({
                uuid: hub.uuid,
                token: hub.token,
                method: "getDefaultOptions",
                name: pluginName
            });
        };

        this.getSkynetPlugins = function(){
            return $http.get('/api/plugins').then(function(result){
                return result.data;
            });
        };

        this.getSkynetPlugin = function(pluginName){
            return $http.get('/api/plugins/' + pluginName).then(function(result){
                return result.data;
            });
        };

        this.getPluginDefaultOptions = function(pluginName){
            return $http.get('/api/plugins/' + pluginName + '/defaultoptions').then(function(result){
                return result.data;
            });
        };

        this.getInstalledPlugins = function (hub) {
            deviceService.gatewayConfig({
                uuid: hub.uuid,
                token: hub.token,
                method: "getPlugins"
            });
        };

        this.installPlugin = function (hub, pluginName) {
            return deviceService.gatewayConfig({
                uuid: hub.uuid,
                token: hub.token,
                method: "installPlugin",
                name : pluginName
            });
        };

        this.uninstallPlugin = function(hub, pluginName){
            return deviceService.gatewayConfig({
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

