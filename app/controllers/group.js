var _ = require('underscore'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    GroupSchema = require('../models/group'),
    Group = mongoose.model('Group', GroupSchema),
    User = mongoose.model('User'),
    request = require('request'),
    uuid = require('node-uuid');

var groupController = {


    /**
     * Adds a new default group for the user with the given UUID and TOKEN
     * the following properties need to be set on the body
     * @url  /api/user/:id/:token/groups
     * @verb POST
     * - name : The name of the new group. The name should not match an existing user group [required]
     * - permissions [optional] - The permissions settings for the group. Valid permissions properties are
     * ['discover', 'configure' and 'update']. Each permission property can be set with a flag indicating whether
     * the permission is enabled (true) or disabled (false).
     * @returns {*}
     */
    addGroup : function( req, res ){

        var name = req.body.name;
        //set
        var permissions = req.body.permissions || {configure : false, discover : true, update : false};
        //Check if the name and permissions are set
        if( ! name ){
         return res.json(400, {
                'error' : 'Missing required parameter: name'
            });
        }

        var skynetuuid = req.params.id;
        var skynettoken = req.params.token;

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
        }, function(error, user){

                if( error ) {
                    console.log(JSON.stringify(error));
                    return res.json(400, error);
                }
                //Throw an exception
                if( ! user ){
                  return res.json(400, {
                      'error' : 'Invalid user'
                  });
                }

                if(! user.groups ){
                    user.groups = [];
                }

                var existingGroup = _.findWhere(user.groups, { 'name' : name});

                if(existingGroup ) {
                   return res.json(400, {'error' : 'group already exists'});
                }


                var group_uuid = uuid.v1();

                var addedGroup = {
                    'name' : name,
                    'uuid' : group_uuid,
                    'type' : 'default',
                    'permissions' : permissions,
                    'members' :[],
                    'devices' : []
                };

                user.groups.push(addedGroup);
                user.markModified('groups');
                user.save(function(error, userInfo){
                    if(error){
                        console.log(JSON.stringify(error));
                        //Don't return the error object back to the client.
                        return res.json(500, 'Internal Server Error');
                    }
                    return res.json(200, addedGroup );
                });
            });

    }
};



module.exports = function(app){
    // GET POST PUT DELETE /groups
// curl http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups
    app.get('/api/user/:id/groups', function (req, res) {
        User.findOne({ $or: [
            {'local.skynetuuid' : req.params.id},
            {'twitter.skynetuuid' : req.params.id},
            {'facebook.skynetuuid' : req.params.id},
            {'google.skynetuuid' : req.params.id}
        ]
        }, function(err, userInfo) {
            console.log(userInfo);
            if (err) {
                res.send(err);
            } else {
                res.json({groups:userInfo.groups});
            }
        });
    });

// curl -X POST -H 'Content-Type:application/json' -d '{"name":"family","permissions":{"discover":true,"message":true,"configure":false}}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups

    app.post('/api/user/:id/:token/groups', groupController.addGroup );

// curl -X DELETE http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/76893990-cbe9-11e3-897a-b94740070267
    app.delete('/api/user/:id/groups/:uuid', function (req, res) {
        User.findOne({ $or: [
            {'local.skynetuuid' : req.params.id},
            {'twitter.skynetuuid' : req.params.id},
            {'facebook.skynetuuid' : req.params.id},
            {'google.skynetuuid' : req.params.id}
        ]
        }, function(err, userInfo) {
            // console.log(userInfo);
            if (err) {
                res.send(err);
            } else {
                var groupFound = false;
                for (var i=0; i < userInfo.groups.length; i++) {
                    if (userInfo.groups[i].uuid == req.params.uuid) {
                        userInfo.groups.splice(i,1);
                        userInfo.markModified('groups');

                        userInfo.save(function(err) {
                            if(!err) {
                                console.log(userInfo);
                                res.json({groups:userInfo.groups});

                            } else {
                                console.log('Error: ' + err);
                                res.json(err);
                            }
                        });
                        groupFound = true;
                        break;
                    }
                }

                if(!groupFound){
                    res.json(404, {'group': 'not found'});
                }

            }
        });
    });

// curl -X PUT -H 'Content-Type:application/json' -d '{"name":"family","type":"operators","permissions":{"configure":true}}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/b6f1f200-d15d-11e3-9327-03d1d0e5e715
    app.put('/api/user/:id/groups/:uuid', function (req, res) {
        User.findOne({ $or: [
            {'local.skynetuuid' : req.params.id},
            {'twitter.skynetuuid' : req.params.id},
            {'facebook.skynetuuid' : req.params.id},
            {'google.skynetuuid' : req.params.id}
        ]
        }, function(err, userInfo) {
            // console.log(userInfo);
            if (err) {
                res.send(err);
            } else {
                var groupFound = false;
                for (var i=0; i < userInfo.groups.length; i++) {
                    if (userInfo.groups[i].uuid == req.params.uuid) {
                        console.log(userInfo.groups[i]);
                        try {
                            var data = JSON.parse(req.body);
                        } catch (e){
                            var data = req.body;
                        }

                        if (data.name){
                            userInfo.groups[i].name = data.name;
                        }

                        if (data.type){
                            userInfo.groups[i].type = data.type;
                        }

                        if(data.permissions){
                            if (data.permissions.discover == true){
                                userInfo.groups[i].permissions.discover = true
                            } else if (data.permissions.discover == false){
                                userInfo.groups[i].permissions.discover = false
                            }
                            if (data.permissions.message == true){
                                userInfo.groups[i].permissions.message = true
                            } else if (data.permissions.message == false){
                                userInfo.groups[i].permissions.message = false
                            }
                            if (data.permissions.configure == true){
                                userInfo.groups[i].permissions.configure = true
                            } else if (data.permissions.configure == false){
                                userInfo.groups[i].permissions.configure = false
                            }
                        }

                        userInfo.markModified('groups');

                        userInfo.save(function(err, data, updated) {
                            if(!err) {
                                console.log(data);
                                res.json({group: data.groups[i]});

                            } else {
                                console.log('Error: ' + err);
                                res.json(err);
                            }
                        });
                        groupFound = true;
                        break;
                    }
                }

                if(!groupFound){
                    res.json(404, {'group': 'not found'});
                }

            }
        });
    });

// curl http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/590ae120-cbf8-11e3-b558-afc0266c35f3
    app.get('/api/user/:id/groups/:uuid', function (req, res) {
        User.findOne({ $or: [
            {'local.skynetuuid' : req.params.id},
            {'twitter.skynetuuid' : req.params.id},
            {'facebook.skynetuuid' : req.params.id},
            {'google.skynetuuid' : req.params.id}
        ]
        }, function(err, userInfo) {
            // console.log(userInfo);
            if (err) {
                res.send(err);
            } else {
                var groupFound = false;
                for (var i=0; i < userInfo.groups.length; i++) {
                    if (userInfo.groups[i].uuid == req.params.uuid) {
                        res.json({group:userInfo.groups[i]});
                        groupFound = true;
                        break;
                    };
                }

            }

            if(!groupFound){
                res.json(404, {'group': 'not found'});
            }

        });
    });


// GET POST PUT DELETE /groups/:uuid/members
// curl http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/590ae120-cbf8-11e3-b558-afc0266c35f3/members
    app.get('/api/user/:id/groups/:uuid/members', function (req, res) {
        User.findOne({ $or: [
            {'local.skynetuuid' : req.params.id},
            {'twitter.skynetuuid' : req.params.id},
            {'facebook.skynetuuid' : req.params.id},
            {'google.skynetuuid' : req.params.id}
        ]
        }, function(err, userInfo) {
            // console.log(userInfo);
            if (err) {
                res.send(err);
            } else {
                var groupFound = false;
                for (var i=0; i < userInfo.groups.length; i++) {
                    if (userInfo.groups[i].uuid == req.params.uuid) {
                        res.json({members: userInfo.groups[i].members});
                        groupFound = true;
                        break;
                    };
                }

            }

            if(!groupFound){
                res.json(404, {'group': 'not found'});
            }

        });
    });

// curl -X POST -H 'Content-Type:application/json' -d '{"uuid":"123", devices:[{"uuid":"123", "token":"abc"}]}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/b6f1f200-d15d-11e3-9327-03d1d0e5e715/members
    app.post('/api/user/:id/groups/:uuid/members', function (req, res) {
        User.findOne({ $or: [
            {'local.skynetuuid' : req.params.id},
            {'twitter.skynetuuid' : req.params.id},
            {'facebook.skynetuuid' : req.params.id},
            {'google.skynetuuid' : req.params.id}
        ]
        }, function(err, userInfo) {
            if (err) {
                res.send(err);
            } else {

                var groupFound = false;
                for (var i=0; i < userInfo.groups.length; i++) {
                    if (userInfo.groups[i].uuid == req.params.uuid) {
                        try {
                            var data = JSON.parse(req.body);
                        } catch (e){
                            var data = req.body;
                        }

                        userInfo.groups[i].members.push(data.uuid);
                        userInfo.markModified('groups');

                        // Setup perminssion arrays
                        if (userInfo.groups[i].permissions.discover){
                            var viewPerms = userInfo.groups[i].members;
                        } else {
                            var viewPerms = [];
                        }

                        if (userInfo.groups[i].permissions.message){
                            var sendPerms = userInfo.groups[i].members;
                        } else {
                            var sendPerms = [];
                        }

                        if (userInfo.groups[i].permissions.configure){
                            var updatePerms = userInfo.groups[i].members;
                        } else {
                            var updatePerms = [];
                        }

                        if (data.devices){
                            for (var device=0; i < data.devices.length; device++) {
                                // Update Skynet device permissions
                                request.put(req.protocol + '://' + app.locals.skynetUrl + '/devices/' + data.devices[device].uuid,
                                    {form: {
                                        'token': data.devices[device].token,
                                        'viewPermissions': viewPerms,
                                        'sendPermissions': sendPerms,
                                        'updatePermissions': updatePerms
                                    }}
                                    , function (error, response, body) {
                                        if(response.statusCode == 200){
                                            console.log(body);
                                        }
                                    }
                                );
                            };
                        };

                        userInfo.save(function(err, data, affected) {
                            if(!err) {
                                console.log(userInfo);
                                res.json({members: data.groups[i].members});

                            } else {
                                console.log('Error: ' + err);
                                res.json(err);
                            }
                        });
                        groupFound = true;
                        break;
                    }
                }

                if(!groupFound){
                    res.json(404, {'group': 'not found'});
                }

            }
        });
    });

// curl -X DELETE http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/b6f1f200-d15d-11e3-9327-03d1d0e5e715/members/123
    app.delete('/api/user/:id/groups/:uuid/members/:user', function (req, res) {
        User.findOne({ $or: [
            {'local.skynetuuid' : req.params.id},
            {'twitter.skynetuuid' : req.params.id},
            {'facebook.skynetuuid' : req.params.id},
            {'google.skynetuuid' : req.params.id}
        ]
        }, function(err, userInfo) {
            // console.log(userInfo);
            if (err) {
                res.send(err);
            } else {
                var memberFound = false;
                for (var i=0; i < userInfo.groups.length; i++) {
                    if (userInfo.groups[i].uuid == req.params.uuid) {

                        // for (var j=0; j < userInfo.groups[i].members.length; j++) {
                        //    if (userInfo.groups[i].members[j].uuid == req.params.user) {
                        //
                        //       userInfo.groups[i].members.splice(j,1);
                        //       userInfo.markModified('groups');
                        //
                        //       userInfo.save(function(err, data, affected) {
                        //         if(!err) {
                        //           console.log(userInfo.groups[i]);
                        //           res.json({'member': 'deleted' });
                        //
                        //         } else {
                        //           console.log('Error: ' + err);
                        //           res.json(err);
                        //         }
                        //       });
                        //       memberFound = true;
                        //       break;
                        //     }
                        //   }

                        var j = userInfo.groups[i].members.indexOf(req.params.user);
                        console.log(j);
                        if (!j){
                            userInfo.groups[i].members.splice(j,1);
                            userInfo.markModified('groups');

                            userInfo.save(function(err, data, affected) {
                                if(!err) {
                                    console.log(userInfo);
                                    res.json({'member': 'deleted'});

                                } else {
                                    console.log('Error: ' + err);
                                    res.json(err);
                                }
                            });
                            memberFound = true;
                            break;

                        }


                    }
                }

                if(!memberFound){
                    res.json(404, {'member': 'not found'});
                }

            }
        });
    });

// GET POST PUT DELETE /groups/:uuid/devices
// curl http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/590ae120-cbf8-11e3-b558-afc0266c35f3/devices
    app.get('/api/user/:id/groups/:uuid/devices', function (req, res) {
        User.findOne({ $or: [
            {'local.skynetuuid' : req.params.id},
            {'twitter.skynetuuid' : req.params.id},
            {'facebook.skynetuuid' : req.params.id},
            {'google.skynetuuid' : req.params.id}
        ]
        }, function(err, userInfo) {
            console.log(userInfo);
            if (err) {
                res.send(err);
            } else {
                var groupFound = false;
                for (var i=0; i < userInfo.groups.length; i++) {
                    if (userInfo.groups[i].uuid == req.params.uuid) {
                        res.json({devices: userInfo.groups[i].devices});
                        groupFound = true;
                        break;
                    };
                }

            }

            if(!groupFound){
                res.json(404, {'group': 'not found'});
            }

        });
    });

// curl -X POST  -H 'Content-Type:application/json' -d '{"uuid":"123"}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/2b3f13e0-cbff-11e3-b829-9b73ed50a879/devices
    app.post('/api/user/:id/groups/:uuid/devices', function (req, res) {
        User.findOne({ $or: [
            {'local.skynetuuid' : req.params.id},
            {'twitter.skynetuuid' : req.params.id},
            {'facebook.skynetuuid' : req.params.id},
            {'google.skynetuuid' : req.params.id}
        ]
        }, function(err, userInfo) {
            console.log(userInfo);
            if (err) {
                res.send(err);
            } else {

                var groupFound = false;
                for (var i=0; i < userInfo.groups.length; i++) {
                    if (userInfo.groups[i].uuid == req.params.uuid) {

                        try {
                            var data = JSON.parse(req.body);
                        } catch (e){
                            var data = req.body;
                        }

                        userInfo.groups[i].devices.push(data.uuid);
                        userInfo.markModified('groups');
                        userInfo.save(function(err, data, affected) {
                            console.log(affected);
                            if(!err) {
                                console.log(userInfo);
                                res.json({devices: data.groups[i].devices});

                            } else {
                                console.log('Error: ' + err);
                                res.json(err);
                            }
                        });
                        groupFound = true;
                        break;
                    }
                }

                if(!groupFound){
                    res.json(404, {'group': 'not found'});
                }

            }
        });
    });

// curl -X DELETE http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/590ae120-cbf8-11e3-b558-afc0266c35f3/devices/123
    app.delete('/api/user/:id/groups/:uuid/devices/:user', function (req, res) {
        User.findOne({ $or: [
            {'local.skynetuuid' : req.params.id},
            {'twitter.skynetuuid' : req.params.id},
            {'facebook.skynetuuid' : req.params.id},
            {'google.skynetuuid' : req.params.id}
        ]
        }, function(err, userInfo) {
            // console.log(userInfo);
            if (err) {
                res.send(err);
            } else {
                var memberFound = false;
                for (var i=0; i < userInfo.groups.length; i++) {
                    if (userInfo.groups[i].uuid == req.params.uuid) {

                        var j = userInfo.groups[i].devices.indexOf(req.params.user);
                        console.log(j);
                        if (!j){
                            userInfo.groups[i].devices.splice(j,1);
                            userInfo.markModified('groups');

                            userInfo.save(function(err, data, affected) {
                                if(!err) {
                                    console.log(userInfo);
                                    res.json({'devices': 'deleted'});

                                } else {
                                    console.log('Error: ' + err);
                                    res.json(err);
                                }
                            });
                            memberFound = true;
                            break;

                        }
                    }
                }

                if(!memberFound){
                    res.json(404, {'device': 'not found'});
                }

            }
        });
    });

};



