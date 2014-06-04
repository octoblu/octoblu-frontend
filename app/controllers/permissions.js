var _ = require('lodash'),
    mongoose = require('mongoose'),
    Group = mongoose.model('Group'),
    User = mongoose.model('User'),
    ResourcePermission = mongoose.model('ResourcePermission'),
    request = require('request'),
    uuid = require('node-uuid'),
    isAuthenticated = require('./controller-middleware').isAuthenticated;

//Look in /test folder for postman api dump.
var permissionsController = {
    //Right now, you can only see permissions that *you* have created -
    //Though we will probably have to check your permissions to see other device permissions later. Meta.
    getResourcePermissionsById: function (req, res) {
        var user = req.user;
        ResourcePermission.findOne({
            uuid: req.params.uuid,
            grantedBy: user.skynetuuid
        }).exec().then(function (group) {
            res.send(200, group);
        }, function (error) {
            res.send(400, error);
        });
    },

    /**
     *
     * @param req
     * @param res
     */
    createResourcePermission: function (req, res) {

    },
    /**
     *
     * @param req
     * @param res
     */
    updateResourcePermission: function (req, res) {

    },

    /**
     *
     * @param req
     * @param res
     */
    deleteResourcePermission: function (req, res) {


    }
};


module.exports = function (app) {

    permissionsController.skynetUrl = app.locals.skynetUrl;

//    app.get('/api/permissions/source/:uuid', isAuthenticated, permissionsController.getResourceSourcePermissions);
//    app.get('/api/permissions/target/:uuid', isAuthenticated, permissionsController.getResourceTargetPermissions);
    app.get('/api/permissions/:uuid', isAuthenticated, permissionsController.getResourcePermissionsById);
//
//    app.post('/api/permissions/:uuid/permissions', isAuthenticated, permissionsController.createResourcePermission);
//
//    app.put('/api/permissions/:uuid/permissions', isAuthenticated, permissionsController.updateResourcePermission);
//
//    app.delete('/api/permissions/:uuid/permissions', isAuthenticated, permissionsController.deleteResourcePermission);

};



