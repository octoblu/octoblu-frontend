var _ = require('lodash'),
    mongoose = require('mongoose'),
    Q = require('q'),
    Group = mongoose.model('Group'),
    ResourcePermission = require('../models/resourcePermission');
    User = mongoose.model('User'),
    request = require('request'),
    uuid = require('node-uuid'),
    isAuthenticated = require('./middleware/security').isAuthenticated;

//Look in /test folder for postman api dump.
var permissionsController = {
    //Right now, you can only see permissions that *you* have created -
    //Though we will probably have to check your permissions to see other device permissions later. Meta.
    getResourcePermissionsById: function (req, res) {
        var user = req.user;
        ResourcePermission.findOne({
            uuid: req.params.uuid,
            'resource.owner.uuid': user.resource.uuid
        }).then(function (rscPermission) {
            res.send(200, rscPermission);
        }, function (error) {
            res.send(400, error);
        });
    },

    createResourcePermission: function (req, res) {
        var user, newUuid, resourcePermission;
        user = req.user;
        newUuid = uuid.v1();
        resourcePermission = {
            uuid: newUuid,
            source: req.body.source,
            target: req.body.target,
            permission: req.body.permission,
            name: req.body.name,
            resource: {
                uuid: newUuid,
                type: 'permission',
                owner: user.resourceId
            }
        };

        ResourcePermission.insert(resourcePermission).then(function (result) {
            res.send(200, resourcePermission);
        }).catch(function(error) {
            if (error) {
                console.error(error);
                res.send(500, error);
                return;
            }
        });
    },

    updateGroupResourcePermission: function (req, res) {
        var user = req.user,
            skynetUrl = req.protocol + '://' + permissionsController.skynetUrl,
            newPermission = req.body.resourcePermission,
            newSourceGroup = req.body.sourceGroup,
            newTargetGroup = req.body.targetGroup;

        newTargetGroup.members = _.map(newTargetGroup.members, function(member){
           return _.omit(member, ['token', 'skynettoken']);
        });

        Q.all([
            ResourcePermission.findOne({
                'resource.uuid': req.params.uuid,
                'resource.owner.uuid': user.resource.uuid
            }),
            Group.findOne({
                'resource.owner.uuid': user.resource.uuid,
                'resource.uuid': newSourceGroup.resource.uuid
            }).exec(),
            Group.findOne({
                'resource.owner.uuid': user.resource.uuid,
                'resource.uuid': newTargetGroup.resource.uuid
            }).exec()
        ]).then(function (results) {
            var dbPermission = results[0], dbSourceGroup = results[1], dbTargetGroup = results[2];
            var membersToUpdate = _.uniq(_.union(dbTargetGroup.members, newTargetGroup.members), function (member) {
                return member.uuid;
            });

            var updatedPermission = _.extend(dbPermission, {
                permissions: newPermission.permissions,
                source: newPermission.source,
                target: newPermission.target
            });
            updatedPermission.resource.properties = newPermission.resource.properties;

            //once we emulate the resource map on devices, we won't need this.
            dbTargetGroup.members = _.map(newTargetGroup.members, function(member){
                return _.omit(member, 'token', 'skynettoken');
            });

            dbSourceGroup.members = _.map(newSourceGroup.members, function(member){
                return _.omit(member, 'token', 'skynettoken');
            });

            return Q.all([
                ResourcePermission.update({_id : updatedPermission._id}, updatedPermission),
                dbSourceGroup.saveWithPromise(),
                dbTargetGroup.saveWithPromise()
            ])
                .then(function (results) {
                    ResourcePermission.updateSkynetPermissions({
                        ownerResource: user.resource,
                        resources: membersToUpdate,
                        skynetUrl: skynetUrl
                    });
                    return results;
                })
                .then(function (results) {
                    var updatedSourceGroup = results[1].toObject(),
                        updatedTargetGroup = results[2].toObject();
                    updatedPermission.sourceGroup = updatedSourceGroup;
                    updatedPermission.targetGroup = updatedTargetGroup;
                    res.send(updatedPermission);
                });
        }).catch(function (error) {
            console.error(error.message, error.stack)
        });
    },

    deleteResourcePermission: function (req, res) {
        var user = req.user,
            skynetUrl = req.protocol + '://' + permissionsController.skynetUrl,
            permissionUUID = req.params.uuid,
            permission,
            members;
        ResourcePermission.findOne({
            'resource.owner.uuid': user.resource.uuid,
            'resource.uuid': permissionUUID
        })
            .then(function (dbPermission) {
                permission = dbPermission;
            })
            .then(function () {
                return Group.findOne({
                    'resource.owner.uuid': user.resource.uuid,
                    'resource.uuid': permission.target.uuid
                }).exec()
            })
            .then(function (group) {
                members = group.members;
                return Q.all([
                    Group.findOneAndRemove({
                        uuid: permission.target.uuid,
                        'resource.owner.uuid': user.resource.uuid
                    }).exec(),
                    Group.findOneAndRemove({
                        uuid: permission.source.uuid,
                        'resource.owner.uuid': user.resource.uuid
                    }).exec(),
                    ResourcePermission.findOneAndRemove({
                        'resource.uuid': permission.resource.uuid,
                        'resource.owner.uuid': user.resource.uuid
                    })
                ]);
            })
            .then(function () {
                return ResourcePermission.updateSkynetPermissions(user.resource,
                    members, skynetUrl);
            })
            .then(function (compiledPermissions) {
                res.send(compiledPermissions);
            },
            function (err) {
                console.error(err.message, err.stack)
                res.send(400, err);
            }
        );
    },

    getResourcePermissions: function (req, res) {
        var user = req.user;
        ResourcePermission.find({
            'resource.owner.uuid': user.resource.uuid
        }).then(function (resourcePermissions) {
            res.send(200, resourcePermissions);
        }).catch(function(error) {
            if (error) {
                console.error(error.message, error.stack);
                res.send(400, error);
                return;
            }
        });
    },

    getGroupResourcePermissions: function (req, res) {
        ResourcePermission.find({
            'resource.owner.uuid': req.user.resource.uuid,
            'source.type': 'group',
            'target.type': 'group',
            'resource.parent': undefined
        }).then(function (permissions) {
                res.send(permissions);
            }, function (err) {
                console.error(err.message, err.stack)
                res.send(400, err);
            });
    },

    getPermissionsByTarget: function (req, res) {
        ResourcePermission.findPermissionsOnResource({
            ownerUUID: req.user.resource.uuid,
            resourceUUID: req.params.uuid,
            permissionDirection: 'target'
        }).then(function (permissions) {
                res.send(permissions);
            },
            function (err) {
                console.error(err.message, err.stack)
                res.send(400, err);
            }
        )
    },

    getFlattenedPermissionsByTarget: function (req, res) {
        ResourcePermission.findFlattenedPermissionsOnResource({
            ownerUUID: req.user.resource.uuid,
            resourceUUID: req.params.uuid,
            permissionDirection: 'target'
        }).then(function (permissions) {
            res.send(permissions);
        }, function (err) {
console.error(err.message, err.stack)
            res.send(400, err);
        });
    },

    getCompiledPermissionsByTarget: function (req, res) {
        ResourcePermission.findCompiledPermissionsOnResource({
            ownerUUID: req.user.resource.uuid,
            resourceUUID: req.params.uuid,
            permissionDirection: 'target'
        }).then(function (permissions) {
                res.send(permissions);
            },
            function (err) {
                console.error(err.message, err.stack)
                res.send(400, err);
            }
        );
    },

    getPermissionsBySource: function (req, res) {
        ResourcePermission.findPermissionsOnResource({
            ownerUUID: req.user.resource.uuid,
            resourceUUID: req.params.uuid,
            permissionDirection: 'source'
        }).then(function (permissions) {
                res.send(permissions);
            },
            function (err) {
                console.error(err.message, err.stack)
                res.send(400, err);
            }
        )
    },

    getMySharedResourceTargets: function (req, res) {
        ResourcePermission.findFlattenedPermissionsOnResource({
            resourceUUID: req.user.resource.uuid,
            permissionDirection: 'source'
        }).then(function (permissions) {
                res.send(permissions);
            },
            function (err) {
                console.error(err.message, err.stack)
                res.send(400, err);
            });
    },

    getFlattenedPermissionsBySource: function (req, res) {
        ResourcePermission.findFlattenedPermissionsOnResource({
            ownerUUID: req.user.resource.uuid,
            resourceUUID: req.params.uuid,
            permissionDirection: 'source'
        }).then(function (permissions) {
                res.send(permissions);
            },
            function (err) {
                console.error(err.message, err.stack)
                res.send(400, err);
            }
        );
    },

    getCompiledPermissionsBySource: function (req, res) {
        ResourcePermission.findCompiledPermissionsOnResource({
            ownerUUID: req.user.resource.uuid,
            resourceUUID: req.params.uuid,
            permissionDirection: 'source'
        }).then(function (permissions) {
                res.send(permissions);
            },
            function (err) {
                console.error(err.message, err.stack)
                res.send(400, err);
            }
        );
    }
};


module.exports = function (app) {
    permissionsController.skynetUrl = app.locals.skynetUrl;
    app.get('/api/permissions', permissionsController.getResourcePermissions);
    app.get('/api/permissions/groups', permissionsController.getGroupResourcePermissions);

    app.get('/api/permissions/:uuid', permissionsController.getResourcePermissionsById);
    app.get('/api/permissions/target/:uuid', permissionsController.getPermissionsByTarget);
    app.get('/api/permissions/target/:uuid/flat', permissionsController.getFlattenedPermissionsByTarget);
    app.get('/api/permissions/target/:uuid/compiled', permissionsController.getCompiledPermissionsByTarget);
    app.get('/api/permissions/source/:uuid', permissionsController.getPermissionsBySource);
    app.get('/api/permissions/source/:uuid/flat', permissionsController.getFlattenedPermissionsBySource);
    app.get('/api/permissions/source/:uuid/compiled', permissionsController.getCompiledPermissionsBySource);

    app.delete('/api/permissions/:uuid', permissionsController.deleteResourcePermission);
    app.put('/api/permissions/:uuid', permissionsController.updateGroupResourcePermission);
    app.post('/api/permissions', permissionsController.createResourcePermission);

    app.get('/api/permissions/shared/:type?', permissionsController.getMySharedResourceTargets);
};



