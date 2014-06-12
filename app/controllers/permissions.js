var _ = require('lodash'),
    mongoose = require('mongoose'),
    Q = require('q'),
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
            'resource.owner.uuid': user.resource.uuid
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
        var user = req.user;
        var resourcePermission = new ResourcePermission({
            source: req.body.source,
            target: req.body.target,
            permission: req.body.permission,
            name: req.body.name,
            resource: {
                type: 'permission',
                owner: user.resourceId
            }
        });

        resourcePermission.save(function (error, rscPermission) {
            if (error) {
                console.log(error);
                res.send(500, error);
                return;
            }
            res.send(200, rscPermission);
        });
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
    updateGroupResourcePermission: function (req, res) {
        var user = req.user,
            skynetUrl = req.protocol + '://' + permissionsController.skynetUrl,
            permission = req.body.resourcePermission,
            targetGroup = req.body.targetGroup,
            sourceGroup = req.body.sourceGroup,
            members,
            compiledPermissions;

        ResourcePermission.findOne({
            'resource.uuid': req.params.uuid,
            'resource.owner.uuid': user.resource.uuid
        }).exec()
            .then(function (rscPermission) {

                rscPermission.set({
                    source: permission.source,
                    target: permission.target,
                    permissions: permission.permissions,
                    'resource.properties': permission.resource.properties
                });

                rscPermission.save(function (err, rscPerm) {
                    if (err) {
                        throw {error: err};
                    }
                    Group.findOne({
                        'resource.owner.uuid': user.resource.uuid,
                        'resource.uuid': rscPerm.target.uuid
                    }).exec()
                        .then(function (group) {
                            members = targetGroup.members;
                            if (group) {
                                members = _.uniq(_.union(members, targetGroup.members), function (member) {
                                    return member.uuid
                                });
                            }
                            return Q.all([
                                Group.update({
                                    uuid: targetGroup.uuid,
                                    'resource.owner.uuid': user.resource.uuid
                                }, {
                                    members: targetGroup.members,
                                    name: targetGroup.name
                                }).exec(),
                                Group.update({
                                    uuid: sourceGroup.uuid,
                                    'resource.owner.uuid': user.resource.uuid
                                }, {
                                    members: sourceGroup.members,
                                    name: sourceGroup.name
                                }).exec()]);
                        })
                        .then(function () {
                            return ResourcePermission.updateSkynetPermissions(user.resource,
                                members, skynetUrl);
                        })
                        .then(function () {
                            res.send(compiledPermissions);
                        },
                        function (err) {
                            res.send(400, err);
                        }
                    );
                });
            });
    },

    /**
     * Find the resource permission with the given UUID and remove it
     * if the user owns it.
     *
     * TODO - This may need to be modified if we introduce the concept of roles to
     * see if the user owns the ResourcePermission or if the user has admin / super user
     * privileges.
     * @param req
     * @param res
     */
    deleteResourcePermission: function (req, res) {
        var user = req.user;
        ResourcePermission.findOneAndRemove({
            uuid: req.params.uuid,
            'resource.owner.uuid': user.resource.uuid
        })
            .exec()
            .then(function (rscPermission) {
                if (!rscPermission) {
                    res.send(400, {'error': 'could not find ResourcePermission'});
                    return;
                }
                res.send(rscPermission);
            }, function (error) {
                if (error) {
                    console.log(error);
                    res.send(400, error);
                }
            });
    },

    /**
     * getResourcePermission finds all the ResourcePermissions
     * that the user has granted as an owner.
     *
     * TODO - This may need to be updated in the future to also include the list
     * of resource permissions that you can see by role
     * @param req
     * @param res
     */
    getResourcePermissions: function (req, res) {
        var user = req.user;
        ResourcePermission.find({
            'resource.owner.uuid': user.resource.uuid
        }, function (error, resourcePermissions) {
            if (error) {
                console.log(error);
                res.send(400, error);
                return;
            }
            res.send(200, resourcePermissions);
        });
    },

    getGroupResourcePermissions: function (req, res) {
        ResourcePermission.find({
            'resource.owner.uuid': req.user.resource.uuid,
            'source.type': 'group',
            'target.type': 'group',
            'resource.parent': undefined
        }).exec()
            .then(function (permissions) {
                res.send(permissions);
            }, function (err) {
                res.send(400, err);
            });
    },
    getPermissionsByTarget: function (req, res) {
        ResourcePermission.findPermissionsOnResource(req.user.resource.uuid, req.params.uuid, 'target')
            .then(function (permissions) {
                res.send(permissions);
            },
            function (err) {
                res.send(400, err);
            }
        )
    },

    getFlattenedPermissionsByTarget: function (req, res) {
        ResourcePermission.findFlattenedPermissionsOnResource(req.user.resource.uuid, req.params.uuid, 'target')
            .then(function (permissions) {
                res.send(permissions);
            },
            function (err) {
                res.send(400, err);
            }
        );
    },

    getCompiledPermissionsByTarget: function (req, res) {
        ResourcePermission.findCompiledPermissionsOnResource(req.user.resource.uuid, req.params.uuid, 'target')
            .then(function (permissions) {
                res.send(permissions);
            },
            function (err) {
                res.send(400, err);
            }
        );
    },
    getPermissionsBySource: function (req, res) {
        ResourcePermission.findPermissionsOnResource(req.user.resource.uuid, req.params.uuid, 'source')
            .then(function (permissions) {
                res.send(permissions);
            },
            function (err) {
                res.send(400, err);
            }
        )
    },
    getFlattenedPermissionsBySource: function (req, res) {
        ResourcePermission.findFlattenedPermissionsOnResource(req.user.resource.uuid, req.params.uuid, 'source')
            .then(function (permissions) {
                res.send(permissions);
            },
            function (err) {
                res.send(400, err);
            }
        );
    },

    getCompiledPermissionsBySource: function (req, res) {
        ResourcePermission.findCompiledPermissionsOnResource(req.user.resource.uuid, req.params.uuid, 'source')
            .then(function (permissions) {
                res.send(permissions);
            },
            function (err) {
                res.send(400, err);
            }
        );
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



