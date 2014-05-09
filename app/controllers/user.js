'use strict';

var _ = require('underscore'),
    moment = require('moment'),
    events = require('../lib/skynetdb').collection('events'),
    mongoose = require('mongoose'),
    Api = mongoose.model('Api'),
    User = mongoose.model('User'),
    request = require('request');

var uuid = require('node-uuid');

module.exports = function (app) {
    // Get user
    app.get('/api/user/:id', function (req, res) {
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
                // not sure why local.password cannot be deleted from user object
                // if (userInfo && userInfo.local){
                // 	userInfo.local.password = null;
                // 	delete userInfo.local.password;
                // }
                res.json(userInfo);
            }
        });
    });

    app.get('/api/user/:id/api/:name', function (req, res) {
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
              console.log('finding the selected api');
              var apiSettings = userInfo.api.filter(function (resource) {
                return resource.name === req.params.name;
              })[0];
              res.json(apiSettings);
            }
        });
    });

    app.put('/api/user/:id/channel/:name', function(req, res) {

        var key = req.body.key,
            token = req.body.token,
            custom_tokens = req.body.custom_tokens;

        User.findOne({ $or: [
            {'local.skynetuuid' : req.params.id},
            {'twitter.skynetuuid' : req.params.id},
            {'facebook.skynetuuid' : req.params.id},
            {'google.skynetuuid' : req.params.id}
        ]
        }, function(err, user) {
            if(!err) {
                user.addOrUpdateApiByName(req.params.name, 'simple', key, token, null, null, custom_tokens);
                user.save(function(err) {
                    if(!err) {
                        console.log(user);
                        res.json(user);

                    } else {
                        console.log('Error: ' + err);
                        res.json(user);
                    }
                });
            } else {
                res.json(err);
            }
        });

    });

    app.put('/api/user/:id/activate/:name', function(req, res) {

        var key = req.body.key,
            token = req.body.token,
            custom_tokens = req.body.custom_tokens;

        User.findOne({ $or: [
            {'local.skynetuuid' : req.params.id},
            {'twitter.skynetuuid' : req.params.id},
            {'facebook.skynetuuid' : req.params.id},
            {'google.skynetuuid' : req.params.id}
        ]
        }, function(err, user) {
            if(!err) {
                user.addOrUpdateApiByName(req.params.name, 'none', null, null, null, null, null);
                user.save(function(err) {
                    if(!err) {
                        console.log(user);
                        res.json(user);

                    } else {
                        console.log('Error: ' + err);
                        res.json(user);
                    }
                });
            } else {
                res.json(err);
            }
        });

    });

    app.delete('/api/user/:id/channel/:name', function(req, res) {

        User.findOne({ $or: [
            {'local.skynetuuid' : req.params.id},
            {'twitter.skynetuuid' : req.params.id},
            {'facebook.skynetuuid' : req.params.id},
            {'google.skynetuuid' : req.params.id}
        ]
        }, function(err, user) {
            if(!err) {

                var found = false,
                    name = req.params.name;
                if(user.api) {
                    for(var i = user.api.length-1; i >= 0; i--) {
                        if(user.api[i].name === name) {
                            user.api.splice(i,1);
                            found = true;
                            break;
                        }
                    }

                    if(found) {
                        user.save(function(err) {
                            if(!err) {
                                res.json({'message': 'success'});

                            } else {
                                console.log('Error: ' + err);
                                res.json(404, {'message': 'not found'});
                            }
                        });
                    } else {
                        res.json(404, {'message': 'not found'});
                    }
                }

            } else {
                res.json(err);
            }
        });

    });

    app.get('/api/user_api/:id/:token', function(req, res) {
        var uuid = req.params.id,
            token = req.params.token;

        User.findOne({ $or: [
            {"local.skynetuuid" : uuid, "local.skynettoken" : token},
            {"twitter.skynetuuid" : uuid, "twitter.skynettoken" : token},
            {"facebook.skynetuuid" : uuid, "facebook.skynettoken" : token},
            {"google.skynetuuid" : uuid, "google.skynettoken" : token}
        ]
        }, function(err, user) {
            if(err) { res.json(err); } else {
                var criteria = [];
                if(!user || !user.api) {
                    res.json(404, {'result': 'not found'} );
                } else {

                    var userResults = {};
                    userResults.prefix = '';
                    userResults.avatar = false;
                    userResults.email = '';
                    //Fix for obj.length since that was returning the length of non-exist values.
                    var checkLength = function(obj){
                        var i = 0;
                        for(var x in obj){
                            if(obj[x] && obj.hasOwnProperty(x) && typeof obj[x] !== 'function'){
                                i++;
                            }
                        }
                        return i;
                    };
                    //Set standardized user info
                    if(user.local && checkLength(user.local)){
                        userResults.email = user.local.email || '';
                        userResults.avatar = 'http://avatars.io/email/' + userResults.email;
                        userResults.type = 'local';
                        userResults.name = user.local.username || '';
                    }else if(user.twitter && checkLength(user.twitter)){
                        userResults.prefix = '@';
                        userResults.type = 'twitter';
                        userResults.name = user.twitter.username || '';
                    }else if(user.facebook && checkLength(user.facebook)){
                        userResults.avatar = 'https://graph.facebook.com/' + user.facebook.id;
                        userResults.type = 'facebook';
                        userResults.name = user.facebook.name;
                    }else if(user.google && checkLength(user.google)){
                        userResults.prefix = '+';
                        userResults.avatar = 'https://plus.google.com/s2/photos/profile/' + user.google.id;
                        userResults.type = 'google';
                        userResults.name = user.google.name || '';
                    }

                    //Admin results
                    userResults.admin = user.admin || false;

                    if(!user.api.length){
                        res.json({
                            results: [],
                            user : userResults
                        });
                        return;
                    }
                    for(var l=0; l<user.api.length; l++) {
                        criteria.push({'name': user.api[l].name});
                    }
                    Api.find({$or: criteria, owner: {$exists: false}, enabled: true},function(err, apis) {
                        if(err) { res.json(err); }
                        var results = [];
                        if(apis){
                            for(var a=0; a<apis.length;a++) {
                                var api = apis[a];
                                var newApi = {};
                                for(var l=0; l<user.api.length; l++) {
                                    if(user.api[l].name===api.name) {
                                        newApi.usersettings = user.api[l];
                                        newApi.wadl = apis[a];
                                        results.push(newApi);
                                    }
                                }
                            }
                        }
                        res.json({
                            results: results,
                            user : userResults
                        });
                    });
                }
            }
        });

    });


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


  // curl -X POST -H 'Content-Type:application/json' -d '{"name":"family","type":"operators","permissions":{"discover":true,"message":true,"configure":false}}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups

  app.post('/api/user/:id/groups', function (req, res) {
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
            if (userInfo.groups == undefined){
              userInfo.groups = [];
            };
            // console.log(userInfo.groups);
            // if(_.contains(userInfo.groups, req.params.name)){
            //   res.json({error:"Group already exists"});
            // } else {
            //   var newUuid = uuid.v1();
            //   // res.json({groups:userInfo.groups});
            // };

            var newUuid = uuid.v1();
            try {
              var data = JSON.parse(req.body);
            } catch (e){
              var data = req.body;
            }

            if (data.permissions){
              if (data.permissions.discover){
                var discover = true;
              } else {
                var discover = false;
              }
              if (data.permissions.message){
                var message = true;
              } else {
                var message = false;
              }
              if (data.permissions.configure){
                var configure = true;
              } else {
                var configure = false;
              }
            } else {
              var discover = false;
              var message = false;
              var configure = false;
            }

            var group = {
              uuid: newUuid,
              name: data.name,
              type: data.type,
              permissions: {
                discover: discover,
                message: message,
                configure: configure
              },
              members: [],
              devices: []
            };
            userInfo.groups.push(group);
            console.log(userInfo.groups);
            userInfo.markModified('groups');

            userInfo.save(function(err, data, numberAffected) {
              if(!err) {
                console.log(userInfo);
                res.json({groups:userInfo.groups});

              } else {
                console.log('Error: ' + err);
                res.json(err);
              }
            });
          }
      });
  });

  // curl -X DELETE -H 'Content-Type:application/json' -d '{"devices":[{"uuid":"26cc6770-b9eb-11e3-a3c6-0b41aaf824e3", "token":"g9ydhs699d9ozuxrwgrt1ov52gap2e29"}]}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/76893990-cbe9-11e3-897a-b94740070267
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

                  try {
                    var reqdata = JSON.parse(req.body);
                  } catch (e){
                    var reqdata = req.body;
                  }

                  reconcileSkyNetPermissions(userInfo.groups[i], userInfo, data.devices);

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

  // curl -X PUT -H 'Content-Type:application/json' -d '{"name":"family","type":"operators","permissions":{"configure":true}, "devices":[{"uuid":"26cc6770-b9eb-11e3-a3c6-0b41aaf824e3", "token":"g9ydhs699d9ozuxrwgrt1ov52gap2e29"}]}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/b6f1f200-d15d-11e3-9327-03d1d0e5e715
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

                  try {
                    var reqdata = JSON.parse(req.body);
                  } catch (e){
                    var reqdata = req.body;
                  }

                  reconcileSkyNetPermissions(userInfo.groups[i], userInfo, data.devices);

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

  // curl -X POST -H 'Content-Type:application/json' -d '{"uuid":"5d6e9c91-820e-11e3-a399-f5b85b6b9fd0", "devices":[{"uuid":"26cc6770-b9eb-11e3-a3c6-0b41aaf824e3", "token":"g9ydhs699d9ozuxrwgrt1ov52gap2e29"}]}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/b6f1f200-d15d-11e3-9327-03d1d0e5e715/members
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

                  reconcileSkyNetPermissions(userInfo.groups[i], userInfo, data.devices);

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

  // curl -X DELETE -H 'Content-Type:application/json' -d '{"devices":[{"uuid":"26cc6770-b9eb-11e3-a3c6-0b41aaf824e3", "token":"g9ydhs699d9ozuxrwgrt1ov52gap2e29"}]}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/b6f1f200-d15d-11e3-9327-03d1d0e5e715/members/111
  app.delete('/api/user/:id/groups/:uuid/members/:user', function (req, res) {
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
            var memberFound = false;
            for (var i=0; i < userInfo.groups.length; i++) {
               if (userInfo.groups[i].uuid == req.params.uuid) {

                var j = userInfo.groups[i].members.indexOf(req.params.user);
                console.log(j);
                if (j>=0){

                  try {
                    var data = JSON.parse(req.body);
                  } catch (e){
                    var data = req.body;
                  }
                  console.log('DATA->', data);

                  userInfo.groups[i].members.splice(j,1);
                  userInfo.markModified('groups');

                  reconcileSkyNetPermissions(userInfo.groups[i], userInfo, data.devices);

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

  // curl -X POST  -H 'Content-Type:application/json' -d '{"uuid":"123", "devices":[{"uuid":"26cc6770-b9eb-11e3-a3c6-0b41aaf824e3", "token":"g9ydhs699d9ozuxrwgrt1ov52gap2e29"}]}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/2b3f13e0-cbff-11e3-b829-9b73ed50a879/devices
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

                  reconcileSkyNetPermissions(userInfo.groups[i], userInfo, data.devices);

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

  // curl -X DELETE -H 'Content-Type:application/json' -d '{"devices":[{"uuid":"26cc6770-b9eb-11e3-a3c6-0b41aaf824e3", "token":"g9ydhs699d9ozuxrwgrt1ov52gap2e29"}]}' http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/590ae120-cbf8-11e3-b558-afc0266c35f3/devices/123
  app.delete('/api/user/:id/groups/:uuid/devices/:user', function (req, res) {
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
            var memberFound = false;
            for (var i=0; i < userInfo.groups.length; i++) {
               if (userInfo.groups[i].uuid == req.params.uuid) {

                  var j = userInfo.groups[i].devices.indexOf(req.params.user);
                  console.log(j);
                  if (j>=0){

                    try {
                      var data = JSON.parse(req.body);
                    } catch (e){
                      var data = req.body;
                    }

                    userInfo.groups[i].devices.splice(j,1);
                    userInfo.markModified('groups');

                    reconcileSkyNetPermissions(userInfo.groups[i], userInfo, data.devices);

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

  function reconcileSkyNetPermissions(currentGroup, user, devices){
    
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
