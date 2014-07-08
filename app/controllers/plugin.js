'use strict';
var _ = require('lodash'),
    pluginMetaData = require('../lib/pluginMetaData'),
    isAuthenticated = require('./middleware/security').isAuthenticated;
var pluginController = {

    getPlugins: function (req, res) {
        //this gets the plugins.
        var user = req.user;
        pluginMetaData
            .getAll()
            .then(function(plugins){
                res.send(plugins);
            }).catch(function(error){
                res.send(400, error);
            });
    },
    getDefaultOptions: function (req, res) {
        var user = req.user;
        pluginMetaData.getDefaultOptions(req.params.name).then(function(options){
            res.send(options);
        }).catch(function(error){
            res.send(400, error);
        });
    },

    getPluginByName: function (req, res) {
        var user = req.user;
      pluginMetaData.getPlugin(req.params.name).then(function(plugin){
          res.send(plugin);
      }).catch(function(error){
          res.send(400, error);
      });
    }
};
module.exports = function (app, config) {
    pluginController.skynetUrl = app.locals.skynetUrl;
    pluginController.config = config;
    app.get('/api/plugins', isAuthenticated, pluginController.getPlugins);
    app.get('/api/plugins/:name', isAuthenticated, pluginController.getPluginByName);
    app.get('/api/plugins/:name/defaultoptions', isAuthenticated, pluginController.getDefaultOptions);
};

