'use strict';

var _ = require('underscore'),
    moment = require('moment'),
    events = require('../lib/skynetdb').collection('events'),
    mongoose = require('mongoose'),
    Api = mongoose.model('Api'),
    User = mongoose.model('User');

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

    app.get('/api/user/:id/events', function (req, res) {
        var curDate = moment();
        var startDate = moment({ year: curDate.year(), month: curDate.month(), date: 1 });

        events
            .find({
                owner: req.params.id,
                eventCode: {
                    $gte: 300,
                    $lt: 400
                },
                timestamp: {
                    $gte: startDate.format(),
                    $lt: curDate.format()
                }
            })
            .count(function (err, count) {
                res.json({
                    total: count
                });
            });
    });

    app.get('/api/user/:id/events/graph', function (req, res) {
        var baseDate = moment();
        var startDate = moment({ year: baseDate.year(), month: baseDate.month(), date: 1 });
        var endDate = moment(startDate).add('months', 1).date(0);

        events
            .group({
                keyf: function (doc) {
                    var date = new Date(doc.timestamp);
                    var dateKey =  date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
                    return { 'date': dateKey };
                },
                cond: {
                    owner: req.params.id,
                    //eventCode: { $gte: 300, $lt: 400 },
                    timestamp:  {
                        $gte: startDate.format(),
                        $lt: endDate.format()
                    }
                },
                initial: { count: 0 },
                reduce: function (curr, result) {
                    result.count++;

                    if (!result[curr.eventCode]) {
                        result[curr.eventCode] = 0;
                    }

                    result[curr.eventCode]++;
                }
            }, function (err, data) {
                res.json(_.map(_.range(1, endDate.date() + 1), function (day) {
                    var curDate = moment({ year: baseDate.year(), month: baseDate.month(), day: day });

                    var item = _.findWhere(data, { date: curDate.format('YYYY-MM-DD') });

                    if (!item) {
                        item = {
                            date: curDate.format('YYYY-MM-DD'),
                            total: 0
                        };
                    }

                    return _.extend(item, { day: curDate.format('M/D') });
                }));
            });
    });

    app.get('/api/user_api/:id/:token', function(req, res) {
        var uuid = req.params.id,
            token = req.params.token

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

                    //Set standardized user info
                    if(user.local && user.local.length){
                        userResults.avatar = 'http://avatars.io/email/' + user.local.email.toString();
                        userResults.email = user.local.email.toString();
                        userResults.type = 'local';
                        userResults.name = user.local.username.toString();
                    }else if(user.twitter){
                        userResults.prefix = '@';
                        userResults.type = 'twitter';
                        userResults.name = user.twitter.username.toString();
                    }else if(user.facebook){
                        userResults.avatar = 'https://graph.facebook.com/' + user.facebook.id.toString();
                        userResults.type = 'facebook';
                        userResults.name = user.facebook.name.toString();
                    }else if(user.google){
                        userResults.prefix = '+';
                        userResults.avatar = 'https://plus.google.com/s2/photos/profile/' + user.google.id.toString();
                        userResults.type = 'google';
                        userResults.name = user.google.name.toString();
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
};
