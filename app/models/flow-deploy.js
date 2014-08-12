var FlowDeploy = function(options){
  var LEGACY_TYPES = {
    'button'   : 'inject',
    'interval' : 'inject',
    'schedule' : 'inject'
  };

  var _this, config, request, userUUID, userToken, port, _, meshblu;
  _this = this;

  options         = options || {};

  userUUID  = options.userUUID;
  userToken = options.userToken;
  config    = options.config  || require('../../config/auth')(process.env.NODE_ENV).designer;
  request   = options.request || require('request');
  port      = options.port;
  meshblu   = options.meshblu;
  _         = require('underscore');

  _this.convertFlows = function(flows){
    var convertedNodes = [];

    _.each(flows, function(flow){
      convertedNodes.push({id: flow.flowId, label: flow.name, type: 'tab'});

      _.each(flow.nodes, function(node){
        convertedNodes.push(_this.convertNode(flow, node));
      });
    });

    return convertedNodes;
  };

  _this.convertNode = function(flow, node){
    var convertedNode, nodeLinks, groupedLinks, largestPort;

    nodeLinks           = _.where(flow.links, {from: node.id});
    groupedLinks        = _.groupBy(nodeLinks, 'fromPort');
    largestPort         = _this.largestPortNumber(groupedLinks);

    convertedNode = _.clone(node);
    convertedNode.z = flow.flowId;
    convertedNode.wires = _this.paddedArray(largestPort);

    convertedNode.type = LEGACY_TYPES[convertedNode.type] || convertedNode.type;

    _.each(groupedLinks, function(links, fromPort){
      var port = parseInt(fromPort);
      convertedNode.wires[port] = _.pluck(links, 'to');
    });

    return convertedNode;
  };

  _this.deployFlows = function(flows){
    meshblu.devices({}, function(data){
      noderedDevices = _.where(data.devices, {type: 'nodered-docker'});
      devices = _.pluck(noderedDevices, 'uuid');
      var msg = {
                devices: devices,
                topic: "flows",
                qos: 0
            };
            msg.payload = {
                flows: flows
            };
      meshblu.message(msg);
    });
  };

  _this.designerUrl = function(){
    return config.host + ':' + port + '/library/flows';
  };

  _this.largestPortNumber = function(groupedLinks){
    var portsKeys = _.keys(groupedLinks);
    var ports = _.map(portsKeys, function(portKey){ return parseInt(portKey); } );
    return _.max(ports);
  };

  _this.paddedArray = function(length){
    return _.map(_.range(length), function(){
      return [];
    });
  };

  _this.registerFlows = function(flows) {
    _.each(flows, function(flow){
      meshblu.register({uuid: flow.flowId, type: 'octoblu:flow', owner: userUUID})
    });
  };
};

FlowDeploy.deploy = function(userUUID, userToken, port, flows, meshblu){
  var data, flowDeploy;

  flowDeploy = new FlowDeploy({userUUID: userUUID, userToken: userToken, port: port, meshblu: meshblu});
  flowDeploy.registerFlows(flows);
  data = flowDeploy.convertFlows(flows);

  flowDeploy.deployFlows(data);
};

module.exports = FlowDeploy;
