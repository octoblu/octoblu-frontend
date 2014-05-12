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
            console.log(userInfo);
            if (err) {
                res.send(err);
            } else {
                res.json({groups:userInfo.groups});
            }
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
        }, function (err, userInfo) {
            // console.log(userInfo);
            if (err) {
                res.send(err);
            } else {
                var groupFound = false;
                for (var i = 0; i < userInfo.groups.length; i++) {
                    if (userInfo.groups[i].uuid == req.params.uuid) {
                        res.json({group: userInfo.groups[i]});
                        groupFound = true;
                        break;
                    }
                    ;
                }

            }

            if (!groupFound) {
                res.json(404, {'group': 'not found'});
            }

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


        var group_uuid = uuid.v1();

        var addedGroup = {
            'name': name,
            'uuid': group_uuid,
            'type': 'default',
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
                        request.put('http://skynet.im/devices/' + devices[device].uuid + '?token=' + devices[device].token,
                            {form: {
                                'viewWhitelist': viewPermissions,
                                'sendWhitelist': sendPermissions,
                                'updateWhitelist': updatePermissions
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
                        request.put('http://skynet.im/devices/' + devices[device].uuid + '?token=' + devices[device].token,
                            {form: {
                                'viewWhitelist': viewPermissions,
                                'sendWhitelist': sendPermissions,
                                'updateWhitelist': updatePermissions
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

    app.get('/api/groups', groupController.getGroups );

// curl -X POST -H 'Content-Type:application/json' -d '{"name":"family","permissions":{"discover":true,"message":true,"configure":false}}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups

    app.post('/api/groups', groupController.addGroup );

// curl -X DELETE http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/76893990-cbe9-11e3-897a-b94740070267
    app.delete('/api/groups/:uuid', groupController.deleteGroup );

// curl -X PUT -H 'Content-Type:application/json' -d '{"name":"family","type":"operators","permissions":{"configure":true}}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/b6f1f200-d15d-11e3-9327-03d1d0e5e715
    app.put('/api/groups/:uuid', groupController.updateGroup );

// curl http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/590ae120-cbf8-11e3-b558-afc0266c35f3
    app.get('/api/groups/:uuid', groupController.getGroupById );


// curl -X POST -H 'Content-Type:application/json' -d '{"uuid":"123", devices:[{"uuid":"123", "token":"abc"}]}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/b6f1f200-d15d-11e3-9327-03d1d0e5e715/members
//    app.post('/api/user/:id/groups/:uuid/members', function (req, res) {
//        User.findOne({ $or: [
//            {'local.skynetuuid' : skynetuuid},
//            {'twitter.skynetuuid' : skynetuuid},
//            {'facebook.skynetuuid' : skynetuuid},
//            {'google.skynetuuid' : skynetuuid}
//        ]
//        }, function(err, userInfo) {
//            if (err) {
//                res.send(err);
//            } else {
//
//                var groupFound = false;
//                for (var i=0; i < userInfo.groups.length; i++) {
//                    if (userInfo.groups[i].uuid == req.params.uuid) {
//                        try {
//                            var data = JSON.parse(req.body);
//                        } catch (e){
//                            var data = req.body;
//                        }
//
//                        userInfo.groups[i].members.push(data.uuid);
//                        userInfo.markModified('groups');
//
//                        // Setup perminssion arrays
//                        if (userInfo.groups[i].permissions.discover){
//                            var viewPerms = userInfo.groups[i].members;
//                        } else {
//                            var viewPerms = [];
//                        }
//
//                        if (userInfo.groups[i].permissions.message){
//                            var sendPerms = userInfo.groups[i].members;
//                        } else {
//                            var sendPerms = [];
//                        }
//
//                        if (userInfo.groups[i].permissions.configure){
//                            var updatePerms = userInfo.groups[i].members;
//                        } else {
//                            var updatePerms = [];
//                        }
//
//                        if (data.devices){
//                            for (var device=0; i < data.devices.length; device++) {
//                                // Update Skynet device permissions
//                                request.put(req.protocol + '://' + app.locals.skynetUrl + '/devices/' + data.devices[device].uuid,
//                                    {form: {
//                                        'token': data.devices[device].token,
//                                        'viewPermissions': viewPerms,
//                                        'sendPermissions': sendPerms,
//                                        'updatePermissions': updatePerms
//                                    }}
//                                    , function (error, response, body) {
//                                        if(response.statusCode == 200){
//                                            console.log(body);
//                                        }
//                                    }
//                                );
//                            };
//                        };
//
//                        userInfo.save(function(err, data, affected) {
//                            if(!err) {
//                                console.log(userInfo);
//                                res.json({members: data.groups[i].members});
//
//                            } else {
//                                console.log('Error: ' + err);
//                                res.json(err);
//                            }
//                        });
//                        groupFound = true;
//                        break;
//                    }
//                }
//
//                if(!groupFound){
//                    res.json(404, {'group': 'not found'});
//                }
//
//            }
//        });
//    });

// curl -X DELETE http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/b6f1f200-d15d-11e3-9327-03d1d0e5e715/members/123
//    app.delete('/api/user/:id/groups/:uuid/members/:user', function (req, res) {
//        User.findOne({ $or: [
//            {'local.skynetuuid' : skynetuuid},
//            {'twitter.skynetuuid' : skynetuuid},
//            {'facebook.skynetuuid' : skynetuuid},
//            {'google.skynetuuid' : skynetuuid}
//        ]
//        }, function(err, userInfo) {
//            // console.log(userInfo);
//            if (err) {
//                res.send(err);
//            } else {
//                var memberFound = false;
//                for (var i=0; i < userInfo.groups.length; i++) {
//                    if (userInfo.groups[i].uuid == req.params.uuid) {
//
//                        // for (var j=0; j < userInfo.groups[i].members.length; j++) {
//                        //    if (userInfo.groups[i].members[j].uuid == req.params.user) {
//                        //
//                        //       userInfo.groups[i].members.splice(j,1);
//                        //       userInfo.markModified('groups');
//                        //
//                        //       userInfo.save(function(err, data, affected) {
//                        //         if(!err) {
//                        //           console.log(userInfo.groups[i]);
//                        //           res.json({'member': 'deleted' });
//                        //
//                        //         } else {
//                        //           console.log('Error: ' + err);
//                        //           res.json(err);
//                        //         }
//                        //       });
//                        //       memberFound = true;
//                        //       break;
//                        //     }
//                        //   }
//
//                        var j = userInfo.groups[i].members.indexOf(req.params.user);
//                        console.log(j);
//                        if (!j){
//                            userInfo.groups[i].members.splice(j,1);
//                            userInfo.markModified('groups');
//
//                            userInfo.save(function(err, data, affected) {
//                                if(!err) {
//                                    console.log(userInfo);
//                                    res.json({'member': 'deleted'});
//
//                                } else {
//                                    console.log('Error: ' + err);
//                                    res.json(err);
//                                }
//                            });
//                            memberFound = true;
//                            break;
//
//                        }
//
//
//                    }
//                }
//
//                if(!memberFound){
//                    res.json(404, {'member': 'not found'});
//                }
//
//            }
//        });
//    });

// GET POST PUT DELETE /groups/:uuid/devices
// curl http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/590ae120-cbf8-11e3-b558-afc0266c35f3/devices
//    app.get('/api/user/:id/groups/:uuid/devices', function (req, res) {
//        User.findOne({ $or: [
//            {'local.skynetuuid' : skynetuuid},
//            {'twitter.skynetuuid' : skynetuuid},
//            {'facebook.skynetuuid' : skynetuuid},
//            {'google.skynetuuid' : skynetuuid}
//        ]
//        }, function(err, userInfo) {
//            console.log(userInfo);
//            if (err) {
//                res.send(err);
//            } else {
//                var groupFound = false;
//                for (var i=0; i < userInfo.groups.length; i++) {
//                    if (userInfo.groups[i].uuid == req.params.uuid) {
//                        res.json({devices: userInfo.groups[i].devices});
//                        groupFound = true;
//                        break;
//                    };
//                }
//
//            }
//
//            if(!groupFound){
//                res.json(404, {'group': 'not found'});
//            }
//
//        });
//    });

// curl -X POST  -H 'Content-Type:application/json' -d '{"uuid":"123"}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/2b3f13e0-cbff-11e3-b829-9b73ed50a879/devices
//    app.post('/api/user/:id/groups/:uuid/devices',
//        function (req, res) {
//        User.findOne({ $or: [
//            {'local.skynetuuid' : skynetuuid},
//            {'twitter.skynetuuid' : skynetuuid},
//            {'facebook.skynetuuid' : skynetuuid},
//            {'google.skynetuuid' : skynetuuid}
//        ]
//        }, function(err, userInfo) {
//            console.log(userInfo);
//            if (err) {
//                res.send(err);
//            } else {
//
//                var groupFound = false;
//                for (var i=0; i < userInfo.groups.length; i++) {
//                    if (userInfo.groups[i].uuid == req.params.uuid) {
//
//                        try {
//                            var data = JSON.parse(req.body);
//                        } catch (e){
//                            var data = req.body;
//                        }
//
//                        userInfo.groups[i].devices.push(data.uuid);
//                        userInfo.markModified('groups');
//                        userInfo.save(function(err, data, affected) {
//                            console.log(affected);
//                            if(!err) {
//                                console.log(userInfo);
//                                res.json({devices: data.groups[i].devices});
//
//                            } else {
//                                console.log('Error: ' + err);
//                                res.json(err);
//                            }
//                        });
//                        groupFound = true;
//                        break;
//                    }
//                }
//
//                if(!groupFound){
//                    res.json(404, {'group': 'not found'});
//                }
//
//            }
//        });
//    }
//    );

// curl -X DELETE http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/590ae120-cbf8-11e3-b558-afc0266c35f3/devices/123
//    app.delete('/api/user/:id/groups/:uuid/devices/:user',
//        function (req, res) {
//        User.findOne({ $or: [
//            {'local.skynetuuid' : skynetuuid},
//            {'twitter.skynetuuid' : skynetuuid},
//            {'facebook.skynetuuid' : skynetuuid},
//            {'google.skynetuuid' : skynetuuid}
//        ]
//        }, function(err, userInfo) {
//            // console.log(userInfo);
//            if (err) {
//                res.send(err);
//            } else {
//                var memberFound = false;
//                for (var i=0; i < userInfo.groups.length; i++) {
//                    if (userInfo.groups[i].uuid == req.params.uuid) {
//
//                        var j = userInfo.groups[i].devices.indexOf(req.params.user);
//                        console.log(j);
//                        if (!j){
//                            userInfo.groups[i].devices.splice(j,1);
//                            userInfo.markModified('groups');
//
//                            userInfo.save(function(err, data, affected) {
//                                if(!err) {
//                                    console.log(userInfo);
//                                    res.json({'devices': 'deleted'});
//
//                                } else {
//                                    console.log('Error: ' + err);
//                                    res.json(err);
//                                }
//                            });
//                            memberFound = true;
//                            break;
//
//                        }
//                    }
//                }
//
//                if(!memberFound){
//                    res.json(404, {'device': 'not found'});
//                }
//
//            }
//        });
//    }
//    );

};



