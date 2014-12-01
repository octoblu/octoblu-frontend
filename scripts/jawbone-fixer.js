var _ = require('lodash');
var jawbone = require('./assets/json/channels/jawbone.json');
var fs = require('fs');
jawbone.application.resources = _.map(jawbone.application.resources, fixJawboneResources);


function fixJawboneResources(resource) {
  resource.params = [];
  return resource;
}

fs.writeFileSync('jawbone-fixed.json', JSON.stringify(jawbone, null, 2));