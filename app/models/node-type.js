'use strict';
var fs   = require('fs');
var when = require('when');
var _    = require('lodash');

var nodetypes = JSON.parse(fs.readFileSync('assets/json/nodetypes.json'));

var NodeType = {
  findAll: function(){
    return when(nodetypes);
  }
};

module.exports = NodeType;
