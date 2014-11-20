var _ = require('lodash'),
    Group = require('../models/group'),
    User = require('../models/user'),
    request = require('request'),
    uuid = require('node-uuid'),
    isAuthenticated = require('./middleware/security').isAuthenticated;

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
        Group.find(queryOptions).then(function (groups) {
            res.send(200, groups);
        }, function (error) {
            console.error(error);
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
        }).then(function (group) {
            res.send(200, group);
        }, function (error) {
            console.error(error);
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
        var user, newUuid, newGroup;
        user = req.user;
        newUuid = uuid.v1();
        newGroup = {
            uuid: newUuid,
            name: req.body.name,
            resource: {
                uuid: newUuid,
                owner: user.resource,
                type: 'group'
            },
            members: [],
            type: 'group'
        };
        Group.insert(newGroup).then(function () {
            res.send(newGroup);
        }).catch(function(error) {
            res.send(400, error);
            return;
        });
    },

    /**
     *
     * @param req
     * @param res
     */
    deleteGroup: function (req, res) {
        var user = req.user, group;
        Group.findOne({
            uuid: req.params.uuid,
            'resource.owner.uuid': user.resource.uuid
        }).then(function (dbGroup) {
            group = dbGroup;
            if (!dbGroup) {
                res.send(400, {error: 'group not found'});
                return;
            }
            return Group.remove({_id: dbGroup._id}).then(function(){
                return Group.remove({'resource.parent.uuid': group.resource.uuid});
            });
        }).then(function (subgroups) {
            res.send({group: group, subgroups: subgroups});
        }).catch(function (error) {
            console.error(error);
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
        }).then(function (dbGroup) {
            if (!dbGroup) {
                res.send(400, {error: 'group not found'});
                return;
            }
            var newGroup = _.extend(dbGroup, {
                name: group.name,
                members: group.members
            });
            //<Model>.update doesn't run pre-commit hooks. So we can't use it for
            //resources.
            Group.update({_id: dbGroup._id}, newGroup).then(function () {
                res.send(newGroup);
            }).catch(function(err) {
                res.send(400, err);
                return;
            });
        });
    },

    getOperatorsGroup: function (req, res) {
        var user = req.user;
        Group.findOne({
            'resource.owner.uuid': req.user.resource.uuid,
            type: 'operators'
        }).then(function (dbGroup) {
            if(dbGroup) {
                return dbGroup;
            }
            return Group.insert({
                name: 'operators',
                type: 'operators',
                resource: {
                    owner: user.resourceId
                }
            });
        })
        .then(function(group){
            res.send(group);
        }).catch(function (err) {
            res.send(400, err);
        });
    },

    getGroupsContainingResource: function (req, res) {
        Group.findGroupsContainingResource(req.user.resource.uuid, req.params.uuid)
            .then(function (groups) {
                res.send(groups);
            }).catch(function (err) {
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
