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
            'resource.owner.uuid' : user.resource.uuid
        }).exec().then(function (rscPermission) {
            res.send(200, rscPermission);
        }, function (error) {
            res.send(400, error);
        });
    },

    /**
     * inputs :
     *   - owner : the resource that owns the permission
     *   - source: the resource that will be granted permission to the target
     *   - target: the target resource
     * @param req
     * @param res
     */
    createResourcePermission: function (req, res) {

    },
    /**
     *
     * inputs:
     *  - resourcePermision:
     *  object containing the updated resource permission
     *  fields in resource permission that can be updated:
     *    - source, target, permission
     *  unmodifiable fields: grantedBy
     * @param req
     * @param res
     */
    updateResourcePermission: function (req, res) {

        var user = req.user;
        ResourcePermission

        Group.findOne({
            uuid: req.params.uuid,
            'resource.owner.uuid': user.resource.uuid
        }).exec().then(function (dbGroup) {
            dbGroup.set({
                name: group.name,
                members: group.members
            });
            //<Model>.update doesn't run pre-commit hooks. So we can't use it for
            //resources.
            dbGroup.save(function (err, dbGroup) {
                if (err) {
                    res.send(400, err);
                    return;
                }
                res.send(dbGroup);
            });
        });




    },

    /**
     *
     * @param req
     * @param res
     */
    deleteResourcePermission: function (req, res) {


    },

    /**
     *
     * @param req
     * @param res
     */
    getResourcePermissions : function(req, res){

    }
};


module.exports = function (app) {

    permissionsController.skynetUrl = app.locals.skynetUrl;

//    app.get('/api/permissions/source/:uuid', isAuthenticated, permissionsController.getResourceSourcePermissions);
//    app.get('/api/permissions/target/:uuid', isAuthenticated, permissionsController.getResourceTargetPermissions);
    app.get('/api/permissions/:uuid', isAuthenticated, permissionsController.getResourcePermissionsById);
    app.put('/api/permissions/:uuid', isAuthenticated, permissionsController.updateResourcePermission);
//
//    app.post('/api/permissions/:uuid/permissions', isAuthenticated, permissionsController.createResourcePermission);
//
//    app.put('/api/permissions/:uuid/permissions', isAuthenticated, permissionsController.updateResourcePermission);
//
//    app.delete('/api/permissions/:uuid/permissions', isAuthenticated, permissionsController.deleteResourcePermission);

};



