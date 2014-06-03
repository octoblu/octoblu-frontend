var _ = require('lodash'),
    mongoose = require('mongoose'),
    Group = mongoose.model('Group'),
    User = mongoose.model('User'),
    ResourcePermission = mongoose.model('ResourcePermission'),
    request = require('request'),
    uuid = require('node-uuid'),
    isAuthenticated = require('./controller-middleware').isAuthenticated ;


var groupController = {

    /**
     *
     * @param req
     * @param res
     */
    getGroups: function (req, res) {

        var user = req.user;
        Group.find({
            owner : user._id
        }).exec().then(function(groups){
            res.send(200, groups);
        }, function(error){
            res.send(400, error);
        });

    },

    /**
     *
     * @param req
     * @param res
     */
    getGroupById: function (req, res) {

        var user = req.user;
        Group.findOne({
            uuid : req.params.uuid,
            owner : user._id
        }).exec().then(function(group){
          res.send(200, group);
        }, function(error){
            res.send(400, error);
        });
    },

    /**
     * Adds a new default group for the user with the given UUID and TOKEN
     * the following properties need to be set on the body
     * @url  /api/groups
     * @verb POST
     * - name : The name of the new group. The name should not match an existing user group [required]
     * - permissions [optional] - The permissions settings for the group. Valid permissions properties are
     * ['discover', 'configure' and 'update']. Each permission property can be set with a flag indicating whether
     * the permission is enabled (true) or disabled (false).
     * @returns {*}
     */
    addGroup: function (req, res) {
        var user = req.user;
        console.log(req.body);
        var newGroup = new Group({
            name: req.body.name,
            resource : {
                owner: user.skynetuuid
            }
        });

        newGroup.save(function (err, dbGroup) {
            if (err) {
                res.send(400, err);
                return;
            }
            var sourceGroup = new Group({
                name: dbGroup.name + '.source',
                type: 'permissions',
                resource : {
                    owner: dbGroup.resource.owner,
                    parent: dbGroup.resource.uuid
                }
            });

            var targetGroup = new Group({
                name: dbGroup.name + '.target',
                type: 'permissions',
                resource : {
                    owner: dbGroup.resource.owner,
                    parent: dbGroup.resource.uuid
                }
            });

            sourceGroup.save(function(err, dbSourceGroup){
                if(err){
                    res.send(400, err);
                    return;
                }

                targetGroup.save(function(err, dbTargetGroup){
                    if(err) {
                        res.send(400, err);
                        return;
                    }

                    var resourcePermission = new ResourcePermission({
                        grantedBy: user.skynetuuid,
                        source : dbSourceGroup.resource.uuid,
                        target: dbTargetGroup.resource.uuid
                    });

                    resourcePermission.save(function(err, dbResourcePermission){
                        if(err) {
                            res.send(400, err);
                            return;
                        }

                        res.send(200, dbGroup );
                    });
                });
            });

        });

    },

    /**
     *
     * @param req
     * @param res
     */
    deleteGroup: function (req, res) {
        var user = req.user;
        Group.findOneAndRemove({
            uuid : req.params.uuid,
            owner : user._id
        }).exec().then(function(group){
            res.send(200, group);
        }, function(error){
            res.send(400, error);
        });
//
    },

    /**
     *
     * @param req
     * @param res
     */
    updateGroup : function(req, res){
        var group = req.body;
        Group.update({ uuid: req.params.uuid },{
            name: group.name,
            members: group.members
        }).exec().then(function(numUpdated) {
            return Group.findOne({ uuid: req.params.uuid}).exec();
        }).then(function(group){
            res.send(group);
        }).then(null, function(error){
            res.send(400, error);
        });
    },

    /**
     *
     * @param req
     * @param res
     */
    getResourcePermissions : function(req, res){
        var user = req.user;

        Group.findResourcePermission(req.params.uuid, user.skynetuuid )
            .then(function(resourcePermission){
               if( ! resourcePermission ) {
                   throw {'error' : 'Resource Permission not found for Group'};
               }
               res.send(200, resourcePermission);
            }, function(error){
               res.send(400, error);
            });
    },

    /**
     *
     * @param req
     * @param res
     */
    createResourcePermission : function(req, res){

    },
    /**
     *
     * @param req
     * @param res
     */
    updateResourcePermission : function(req, res){

    },

    /**
     *
     * @param req
     * @param res
     */
    deleteResourcePermission : function(req, res){


    }
};


module.exports = function (app) {

    groupController.skynetUrl = app.locals.skynetUrl;

    app.get('/api/groups', isAuthenticated, groupController.getGroups);

    app.post('/api/groups', isAuthenticated, groupController.addGroup);

    app.delete('/api/groups/:uuid', isAuthenticated, groupController.deleteGroup);

    app.put('/api/groups/:uuid', isAuthenticated, groupController.updateGroup);

    app.get('/api/groups/:uuid', isAuthenticated, groupController.getGroupById);

    app.get('/api/groups/:uuid/permissions', isAuthenticated, groupController.getResourcePermissions);

    app.post('/api/groups/:uuid/permissions', isAuthenticated, groupController.createResourcePermission);

    app.put('/api/groups/:uuid/permissions', isAuthenticated, groupController.updateResourcePermission);

    app.delete('/api/groups/:uuid/permissions', isAuthenticated, groupController.deleteResourcePermission);



};



