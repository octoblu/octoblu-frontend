'use strict';

var mongojs = require('mongojs');

exports.connect = function (url) {
    module.exports = mongojs.connect(url);
};
