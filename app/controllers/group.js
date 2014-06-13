var _ = require('lodash'),
    mongoose = require('mongoose'),
    Group = mongoose.model('Group'),
    User = mongoose.model('User'),
    ResourcePermission = mongoose.model('ResourcePermission'),
    request = require('request'),
    uuid = require('node-uuid'),
    isAuthenticated = require('./controller-middleware').isAuthenticated;

//Look in /test folder for postman api dump.
var groupController = {
    /**
     *
     * @param req
     * @param res
     */
    getGroups: function (req, res) {
        var user = req.user;
        var queryOptions = {
            'resource.owner.uuid': user.resource.uuid
        };
        if (req.query.type) {
            queryOptions.type = req.query.type;
        }
        Group.find(queryOptions).exec().then(function (groups) {
            res.send(200, groups);
        }, function (error) {
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
            uuid: req.params.uuid,
            'resource.owner.uuid': user.resource.uuid
        }).exec().then(function (group) {
            res.send(200, group);
        }, function (error) {
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
            resource: {
                owner: user.resourceId
            }
        });
        newGroup.save(function (err, dbGroup) {
            if (err) {
                res.send(400, err);
                return;
            }
            res.send(dbGroup);
        });
    },

    /**
     *
     * @param req
     * @param res
     */
    deleteGroup: function (req, res) {
        var user = req.user, group;
        Group.findOneAndRemove({
            uuid: req.params.uuid,
            'resource.owner.uuid': user.resource.uuid
        }).exec()
            .then(function (dbGroup) {
                group = dbGroup;
                if (!dbGroup) {
                    res.send(400, {error: 'group not found'});
                    return;
                }
                return Group.find({'resource.parent.uuid': group.resource.uuid}).remove().exec();
            })
            .then(function (subgroups) {
                res.send({group: group, subgroups: subgroups});
            })
            .then(null, function (error) {
                res.send(400, error);
            });
    },

    /**
     *
     * @param req
     * @param res
     */
    updateGroup: function (req, res) {
        var group = req.body,
            user = req.user;
        var skynetUrl = req.protocol + '://' + groupController.skynetUrl;

        Group.findOne({
            uuid: req.params.uuid,
            'resource.owner.uuid': user.resource.uuid
        }).exec().then(function (dbGroup) {
            if (!dbGroup) {
                res.send(400, {error: 'group not found'});
                return;
            }
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

    getOperatorsGroup: function (req, res) {
        var user = req.user;
        Group.findOne({
            'resource.owner.uuid': req.user.resource.uuid,
            type: 'operators'
        }).exec().then(
            function (dbGroup) {
                if(dbGroup) {
                    return dbGroup;
                }
                return Group.create({
                    name: 'operators',
                    type: 'operators',
                    resource: {
                        owner: user.resourceId
                    }
                });
            })
            .then(function(group){
                res.send(group);
            },
            function (err) {
                res.send(400, err);
            }
        );
    },

    getGroupsContainingResource: function (req, res) {
        Group.findGroupsContainingResource(req.user.resource.uuid, req.params.uuid)
            .then(function (groups) {
                res.send(groups);
            },
            function (err) {
                res.send(err);
            }
        );
    }
};


module.exports = function (app) {

    groupController.skynetUrl = app.locals.skynetUrl;

    app.get('/api/groups', isAuthenticated, groupController.getGroups);

    app.post('/api/groups', isAuthenticated, groupController.addGroup);

    app.get('/api/groups/operators', isAuthenticated, groupController.getOperatorsGroup);

    app.get('/api/groups/contain/:uuid', isAuthenticated, groupController.getGroupsContainingResource);

    app.delete('/api/groups/:uuid', isAuthenticated, groupController.deleteGroup);

    app.put('/api/groups/:uuid', isAuthenticated, groupController.updateGroup);
    app.get('/api/groups/:uuid', isAuthenticated, groupController.getGroupById);
};




