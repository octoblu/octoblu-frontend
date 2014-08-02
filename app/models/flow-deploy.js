var FlowDeploy = function(options){
  var _this, config, request, userUUID, userToken;
  _this = this;

  options         = options || {};

  userUUID  = options.userUUID;
  userToken = options.userToken;
  config    = options.config  || require('../../config/auth')[process.env.NODE_ENV];
  request   = options.request || require('request');
  port      = options.port;

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
    var convertedNode, links;

    convertedNode = _.clone(node);
    convertedNode.z = flow.flowId;
    convertedNode.wires = [];

    links = _.where(flow.links, {from: node.id});
    if(!_.isEmpty(links)){
      convertedNode.wires.push(_.pluck(links, 'to'));
    }
    return convertedNode;
  };

  _this.deployFlows = function(flows){
    request.post(_this.designerUrl(), {json: flows});
  };

  _this.designerUrl = function(){
    return config.host + ':' + port + '/library/flows';
  };
};

FlowDeploy.deploy = function(userUUID, userToken, port, flows){
  var data, flowDeploy;

  flowDeploy = new FlowDeploy({userUUID: userUUID, userToken: userToken, port: port});
  data       = flowDeploy.convertFlows(flows);

  flowDeploy.deployFlows(data);
};

module.exports = FlowDeploy;
