var mongoose = require('mongoose'),
    DeviceType = mongoose.model('DeviceType'),
    Api = mongoose.model('Api')
var permissionsController = {
    getNodes: function (req, res) {
        var nodes;
        Api.find({owner: {$exists: false}, enabled: true}).exec()
            .then(function(channels){
                nodes = channels;
                return DeviceType.find({}).exec();
            })
            .then(function(deviceTypes){

            });
    }
};


module.exports = function (app) {

    permissionsController.skynetUrl = app.locals.skynetUrl;
    app.get('/api/permissions', isAuthenticated, permissionsController.getResourcePermissions);
    app.get('/api/permissions/groups', isAuthenticated, permissionsController.getGroupResourcePermissions);

    app.get('/api/permissions/:uuid', isAuthenticated, permissionsController.getResourcePermissionsById);
    app.get('/api/permissions/target/:uuid', isAuthenticated, permissionsController.getPermissionsByTarget);
    app.get('/api/permissions/target/:uuid/flat', isAuthenticated, permissionsController.getFlattenedPermissionsByTarget);
    app.get('/api/permissions/target/:uuid/compiled', isAuthenticated, permissionsController.getCompiledPermissionsByTarget);
    app.get('/api/permissions/source/:uuid', isAuthenticated, permissionsController.getPermissionsBySource);
    app.get('/api/permissions/source/:uuid/flat', isAuthenticated, permissionsController.getFlattenedPermissionsBySource);
    app.get('/api/permissions/source/:uuid/compiled', isAuthenticated, permissionsController.getCompiledPermissionsBySource);

    app.delete('/api/permissions/:uuid', isAuthenticated, permissionsController.deleteResourcePermission);
    app.put('/api/permissions/:uuid', isAuthenticated, permissionsController.updateGroupResourcePermission);
    app.post('/api/permissions', isAuthenticated, permissionsController.createResourcePermission);

};



