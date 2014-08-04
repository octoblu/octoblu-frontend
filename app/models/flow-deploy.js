var FlowDeploy = function(options){
  var _this, config, request, userUUID, userToken, port, _;
  _this = this;

  options         = options || {};

  userUUID  = options.userUUID;
  userToken = options.userToken;
  config    = options.config  || require('../../config/auth')(process.env.NODE_ENV).designer;
  request   = options.request || require('request');
  port      = options.port;
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

    _.each(groupedLinks, function(links, fromPort){
      var port = parseInt(fromPort);
      convertedNode.wires[port] = _.pluck(links, 'to');
    });

    return convertedNode;
  };

  _this.deployFlows = function(flows){
    console.log(_this.designerUrl());
    request.post(_this.designerUrl(), {json: flows});
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
};

FlowDeploy.deploy = function(userUUID, userToken, port, flows){
  var data, flowDeploy;

  flowDeploy = new FlowDeploy({userUUID: userUUID, userToken: userToken, port: port});
  data       = flowDeploy.convertFlows(flows);

  flowDeploy.deployFlows(data);
};

module.exports = FlowDeploy;
