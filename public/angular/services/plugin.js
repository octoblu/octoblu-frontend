'use strict';
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
            return deviceService.gatewayConfig({
                uuid: hub.uuid,
                token: hub.token,
                method: "getPlugins"
            });
        };

        this.getOrInstallPlugin = function(hub, pluginName){
            var _this = this;

            return this.getInstalledPlugins(hub).then(function(result){
                var plugin = _.findWhere(result.result, {name: pluginName});

                if(plugin){
                    return plugin;
                }

                return _this.installAndReturnPlugin(hub, pluginName);
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

        this.installAndReturnPlugin = function(hub, pluginName){
            var _this = this;

            return this.installPlugin(hub, pluginName).then(function(){
                return _this.waitForPlugin(hub, pluginName);
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

        this.waitForPlugin = function(hub, pluginName){
            var _this = this;

            return this.getInstalledPlugins(hub).then(function(result){
                var defer, plugin;

                plugin = _.findWhere(result.result, {name: pluginName});
                defer = $q.defer();

                if(plugin){
                    return plugin;
                }

                _.delay(function(){
                    defer.resolve(_this.waitForPlugin(hub, pluginName));
                }, 1000);

                return defer.promise;
            });
        };

        this.getAvailablePlugins = function(){
            return $http.get('/api/device/plugins').then(function(result){
                return result.data;
            });
        }
    });

