'use strict';

var moment = require('moment');
var events = require('../lib/skynetdb').collection('events');

exports.eventCount = function (req, res) {
    var curDate = moment();
    var startDate = moment({ year: curDate.year(), month: curDate.month(), date: 1 });

    events
        .find({
            owner: req.params.id,
            eventCode: {
                $gte: 200,
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
};

//exports.eventsGraph = function (req, res) {
//    events
//        .group({
//            keyf: function (doc) {
//                var date = new Date(doc.timestamp);
//                var dateKey = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + '';
//                return { 'day': dateKey };
//            },
//            cond: {
//                owner: req.params.id,
//                eventCode: { $gte: 200, $lt: 400 },
//                timestamp:  {
//                    $gte: ISODate(''),
//                    $lt: new Date().toISOString()
//                }
//            },
//            initial: { count: 0 },
//            reduce: function (obj, prev) {
//                prev.count++;
//            }
//        }, function (err, data) {
//            res.json(data);
//        });
//};
