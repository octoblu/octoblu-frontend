'use strict';

var _ = require('underscore'),
    moment = require('moment'),
    events = require('../lib/skynetdb').collection('events'),
    mongoose = require('mongoose'),
    Api = mongoose.model('Api'),
    User = mongoose.model('User');

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

  // curl -X POST -d "name=family&type=operators" http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups
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
            console.log(userInfo.groups);
            // if(_.contains(userInfo.groups, req.params.name)){
            //   res.json({error:"Group already exists"});
            // } else {
            //   var newUuid = uuid.v1();
            //   // res.json({groups:userInfo.groups});
            // };
            var newUuid = uuid.v1();
            var group = {uuid: newUuid, name: req.body.name, type: req.body.type, members: [], devices: []};
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

  // curl -X PUT -d "name=family&type=operators" http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/590ae120-cbf8-11e3-b558-afc0266c35f3
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
                  if (req.body.name){
                    userInfo.groups[i].name = req.body.name;
                  }
                  if (req.body.type){
                    userInfo.groups[i].type = req.body.type;
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

  // curl -X POST -d "uuid=123" http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/2b3f13e0-cbff-11e3-b829-9b73ed50a879/members
  app.post('/api/user/:id/groups/:uuid/members', function (req, res) {
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
                  userInfo.groups[i].members.push({uuid: req.body.uuid});
                  userInfo.markModified('groups');

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

  // curl -X DELETE http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/590ae120-cbf8-11e3-b558-afc0266c35f3/members/123
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

                for (var j=0; j < userInfo.groups[i].members.length; j++) {
                   if (userInfo.groups[j].members[j].uuid == req.params.user) {

                      userInfo.groups[j].members.splice(j,1);
                      userInfo.markModified('groups');

                      userInfo.save(function(err, data, affected) {
                        if(!err) {
                          console.log(userInfo);
                          res.json({members: data.groups[i].members});

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

  // curl -X POST -d "uuid=123" http://localhost:8080/api/user/5d6e9c91-820e-11e3-a399-f5b85b6b9fd0/groups/2b3f13e0-cbff-11e3-b829-9b73ed50a879/devices
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
                  userInfo.groups[i].devices.push({uuid: req.body.uuid});
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

                for (var j=0; j < userInfo.groups[i].devices.length; j++) {
                   if (userInfo.groups[j].devices[j].uuid == req.params.user) {

                      userInfo.groups[j].devices.splice(j,1);
                      userInfo.markModified('groups');

                      userInfo.save(function(err, data, affected) {
                        if(!err) {
                          console.log(userInfo);
                          res.json({devices: data.groups[i].devices});

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
            }

            if(!memberFound){
              res.json(404, {'devices': 'not found'});
            }

          }
      });
  });


};
