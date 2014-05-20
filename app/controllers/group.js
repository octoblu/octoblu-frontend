var _ = require('lodash'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    GroupSchema = require('../models/group'),
    Group = mongoose.model('Group', GroupSchema),
    User = mongoose.model('User'),
    request = require('request'),
    uuid = require('node-uuid');

var groupController = {

    /**
     *
     * @param req
     * @param res
     */
    getGroups : function(req, res){

        var skynetuuid = req.headers.ob_skynetuuid;
        var skynettoken = req.headers.ob_skynettoken;

        if( ! skynetuuid || ! skynettoken){
            res.json(401, {
                'error' : 'unauthorized'
            });
        }

        var userPromise = User.findBySkynetUUIDAndToken(skynetuuid, skynettoken);
        userPromise.then(function(user){

            res.json(200, user.groups );
        }, function(error){
            res.send(400, "Error");
            console.log(JSON.stringify(error));
        });
    },

    /**
     *
     * @param req
     * @param res
     */
    getGroupById : function(req, res) {

        var skynetuuid = req.headers.ob_skynetuuid;
        var skynettoken = req.headers.ob_skynettoken;

        if( ! skynetuuid || ! skynettoken){
            res.json(401, {
                'error' : 'unauthorized'
            });
        }

        var userPromise = User.findBySkynetUUIDAndToken(skynetuuid, skynettoken);
        userPromise.then(function(user){
            var group = _.findWhere(user.groups, {
                'uuid' : req.params.uuid
            });

            if( group ){
               res.json(group);
            } else {
                res.json(400 , {
                    'error' : 'Group not found'
                });
            }

        }, function(error){
            res.json(400 , {
                'error' : 'unauthorized'
            });
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
    addGroup : function( req, res ) {
    console.log(req);

    var name = req.body.name;
    //set
    var permissions = req.body.permissions || {configure: true, discover: true, update: true};
    //Check if the name and permissions are set
    if (!name) {
        return res.json(400, {
            'error': 'Missing required parameter: name'
        });
    }

    var skynetuuid = req.headers.ob_skynetuuid;
    var skynettoken = req.headers.ob_skynettoken;

    if( ! skynetuuid || ! skynettoken){
        res.json(401, {
            'error' : 'unauthorized'
        });
    }

    User.findOne({ $or: [
        {
            'local.skynetuuid': skynetuuid,
            'local.skynettoken': skynettoken
        },
        {
            'twitter.skynetuuid': skynetuuid,
            'twitter.skynettoken': skynettoken
        },
        {
            'facebook.skynetuuid': skynetuuid,
            'facebook.skynettoken': skynettoken
        },
        {
            'google.skynetuuid': skynetuuid,
            'google.skynettoken': skynettoken
        }
    ]
    }, function (error, user) {

        if (error) {
            console.log(JSON.stringify(error));
            return res.json(400, error);
        }
        //Throw an exception
        if (!user) {
            return res.json(400, {
                'error': 'Invalid user'
            });
        }

        if (!user.groups) {
            user.groups = [];
        }

        var existingGroup = _.findWhere(user.groups, { 'name': name});

        if (existingGroup) {
            return res.json(400, {'error': 'group already exists'});
        }

        if(req.body.type){
            var groupType = req.body.type;
        } else {
            var groupType = 'default';
        }


        var group_uuid = uuid.v1();

        var addedGroup = {
            'name': name,
            'uuid': group_uuid,
            'type': groupType,
            'permissions': permissions,
            'members': [],
            'devices': []
        };

        user.groups.push(addedGroup);
        user.markModified('groups');
        user.save(function (error, userInfo) {
            if (error) {
                console.log(JSON.stringify(error));
                //Don't return the error object back to the client.
                return res.json(500, 'Internal Server Error');
            }
            return res.json(200, addedGroup);
        });
    });


    },

    /**
     *
     * @param req
     * @param res
     */
    deleteGroup : function( req, res ){

        var skynetuuid = req.headers.ob_skynetuuid;
        var skynettoken = req.headers.ob_skynettoken;

        if( ! skynetuuid || ! skynettoken){
            res.json(401, {
                'error' : 'unauthorized'
            });
        }


        User.findOne({ $or: [
            {
                'local.skynetuuid': skynetuuid,
                'local.skynettoken': skynettoken
            },
            {
                'twitter.skynetuuid': skynetuuid,
                'twitter.skynettoken': skynettoken
            },
            {
                'facebook.skynetuuid': skynetuuid,
                'facebook.skynettoken': skynettoken
            },
            {
                'google.skynetuuid': skynetuuid,
                'google.skynettoken': skynettoken
            }
        ]
        }, function(err, userInfo) {
            // console.log(userInfo);
            if (err) {
                res.send(err);
            } else {

                var group = _.findWhere(userInfo.groups, {
                    'uuid' : req.params.uuid
                });
                //Find the group
                if( group ){
                    var groups = _.without(userInfo.groups, group );
                    userInfo.groups = groups;
                    userInfo.markModified('groups');
                    userInfo.save(function(err){
                        if( err ){
                         return res.json(500, {
                                'error' : 'Server Error : Could not delete group '
                            });
                        }
                        return res.json(200, group );
                    });
                } else {
                    res.json(404, {
                        'error' : 'Group not found'
                    });
                }

            }
        });
    },

    updateGroup : function(req, res){
        var skynetuuid = req.headers.ob_skynetuuid;
        var skynettoken = req.headers.ob_skynettoken;

        if( ! skynetuuid || ! skynettoken){
            res.json(401, {
                'error' : 'unauthorized'
            });
        }

        var userPromise = User.findBySkynetUUIDAndToken(skynetuuid, skynettoken);
        userPromise.then(function(user){

            var groupIndex = _.findIndex(user.groups, {'uuid' : req.params.uuid });
            var groupExists = groupIndex >= 0;
            if( ! groupExists ){
                res.send(400 , {"error" : "Group does not exist"});
            }

            if(! req.body.group ){
                res.send(400, {"error" : "missing group parameter"});
            }
            var updatedGroup = req.body.group;

            if( ! updatedGroup.members || ! updatedGroup.permissions || ! updatedGroup.devices ){
                res.send(400, {"error" : "missing group fields [permissions, members, devices]"});
            }

            user.groups[groupIndex].members = updatedGroup.members;
            user.groups[groupIndex].devices = updatedGroup.devices;
            user.groups[groupIndex].permissions = updatedGroup.permissions;
            user.groups[groupIndex].name = updatedGroup.name || user.groups[groupIndex].name;

            user.markModified('groups');
            user.save(function(err, usr){
                if(err){
                    console.log(JSON.stringify(err));
                    res.send(400, {"error": "could not update"});
                }
                res.json(200, usr.groups[groupIndex] );
            });

        }, function(error){

        });

    },

    reconcileSkyNetPermissions : function(currentGroup, user, devices){
        console.log('currentGroup', currentGroup);
        console.log('user', user);
        console.log('devices', devices);

        var commonGroups = _.filter(_.without(user.groups, currentGroup), function(group, index){
            var commonDevices = _.intersection(currentGroup.devices, group.devices);
            console.log('COMMON DEVICES', commonDevices);

            return commonDevices !== undefined && commonDevices.length > 0;
        });

        console.log('COMMON GROUPS', commonGroups);

        if( commonGroups && commonGroups.length > 0 ){

            var groupPermissions =  _.each(commonGroups, function(group){
                var members = _.intersection(currentGroup.members, group.members);
                var commonDevices = _.intersection(currentGroup.devices, group.devices);
                var permission = {};
                if (currentGroup.permissions && group.permissions){
                    permission.discover = currentGroup.permissions.discover || group.permissions.discover;
                    permission.message = currentGroup.permissions.message || group.permissions.message;
                    permission.configure = currentGroup.permissions.configure || group.permissions.configure;
                } else {
                    // TODO: not sure about this...
                    permission.discover = false;
                    permission.message = false;
                    permission.configure = false;
                }

                return {
                    'group'  : group,
                    'members' : members,
                    'commonDevices' : commonDevices,
                    'permissions' : permission
                }

            });

            // return permissionResult;
        };
        console.log('GROUP PERMISSIONS', groupPermissions);
        console.log('DEVICES', currentGroup);
        // for ( uuid in currentGroup.devices ){
        for (var i = 0; i < currentGroup.devices.length; i++) {
            uuid = currentGroup.devices[i];
            console.log("UUID in Current Group", uuid);

            var otherGroupsContainingDevice = _.find(groupPermissions, function(groupPermission){
                console.log('OTHER GROUP PERMISSIONS', groupPermission);
                var deviceIndex = _.indexOf(groupPermission.devices, uuid );
                return deviceIndex >= 0;
            });
            //Do the merge get all the members that you have in common with each group
            //Write the permissions to skynet
            var otherGroupsContainingDevice = [otherGroupsContainingDevice];
            console.log('otherGroupsContainingDevice', otherGroupsContainingDevice);

            //TODO include the other devices as members when writing permissions.


            if(otherGroupsContainingDevice ){

                var uniqueMembers = _.reduceRight(otherGroupsContainingDevice , function( currentMembers, groupPermission, index) {
                    currentMembers = _.uniq(_.union(groupPermission.members, currentMembers));
                    console.log('groupPermission', groupPermission);
                    console.log('currentMembers', currentMembers);
                    return currentMembers;
                }, currentGroup.members);

                var mergedPermission = _.reduce(otherGroupsContainingDevice, function(currentPermission, groupPermission, index ){
                    currentPermission.discover || groupPermission.permissions.discover;
                    currentPermission.configure || groupPermission.permissions.configure;
                    currentPermission.message || groupPermission.permissions.message;
                    return currentPermission;
                    // }, currentPermission.permissions);
                }, currentGroup.permissions);

                var viewPermissions = [];
                var updatePermissions = [];
                var sendPermissions = [];

                if(mergedPermission.discover){
                    viewPermissions = uniqueMembers;
                }


                if(mergedPermission.configure){
                    updatePermissions = uniqueMembers;
                }


                if(mergedPermission.message){
                    sendPermissions = uniqueMembers;
                }
                /*
                 write the array lists to skynet permissions for the current device.
                 */
                for (device in devices){
                    if (devices[device].uuid == uuid ){
                        console.log('writing to skynet', devices[device], viewPermissions, sendPermissions, updatePermissions);
                        request.put('http://skynet.im/devices/' + devices[device].uuid,
                            {form: {
                                'viewWhitelist': viewPermissions,
                                'sendWhitelist': sendPermissions,
                                'updateWhitelist': updatePermissions
                            },headers: {
                                'skynet_auth_uuid': devices[device].uuid,
                                'skynet_auth_token': devices[device].token
                            }}
                            , function (error, response, body) {
                                // if(response.statusCode == 200){
                                console.log(error);
                                console.log(response);
                                console.log(body);
                                // }
                            }
                        );
                    }
                }


            } else {
                /**
                 write all the current group members with the current group permissions to skynet
                 **/
                var viewPermissions = [];
                var updatePermissions = [];
                var sendPermissions = [];

                if(currentGroup.permissions && currentGroup.permissions.discover){
                    viewPermissions = currentGroup.members;
                } else {
                    viewPermissions = [""];
                }

                if(currentGroup.permissions && currentGroup.permissions.message){
                    sendPermissions = currentGroup.members;
                } else {
                    sendPermissions = [""];
                }

                if(currentGroup.permissions && currentGroup.permissions.configure){
                    updatePermissions = currentGroup.members;
                } else {
                    updatePermissions = [""];
                }

                for (var device=0; device < devices.length; device++) {
                    if (devices[device].uuid = uuid){
                        console.log('writing to skynet', devices[device], viewPermissions, sendPermissions, updatePermissions);
                        request.put('http://skynet.im/devices/' + devices[device].uuid,
                            {form: {
                                'viewWhitelist': viewPermissions,
                                'sendWhitelist': sendPermissions,
                                'updateWhitelist': updatePermissions
                            },headers: {
                                'skynet_auth_uuid': devices[device].uuid,
                                'skynet_auth_token': devices[device].token
                            }}
                            , function (error, response, body) {
                                // if(response.statusCode == 200){
                                console.log(error);
                                console.log(response);
                                console.log(body);
                                // }
                            }
                        )
                        // break;
                    }
                }
            }


        }

        /**
         write the skynet permissions with the view update and send permission arrays.
         **/

    }
};



module.exports = function(app){

    groupController.skynetUrl = app.locals.skynetUrl;

    app.get('/api/groups', groupController.getGroups );

// curl -X POST -H 'Content-Type:application/json' -d '{"name":"family","permissions":{"discover":true,"message":true,"configure":false}}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups
    app.post('/api/groups', groupController.addGroup );

// curl -X DELETE http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/76893990-cbe9-11e3-897a-b94740070267
    app.delete('/api/groups/:uuid', groupController.deleteGroup );

// curl -X PUT -H 'Content-Type:application/json' -d '{"name":"family","type":"operators","permissions":{"configure":true}}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/b6f1f200-d15d-11e3-9327-03d1d0e5e715
    app.put('/api/groups/:uuid', groupController.updateGroup );

// curl http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/590ae120-cbf8-11e3-b558-afc0266c35f3
    app.get('/api/groups/:uuid', groupController.getGroupById );

};



