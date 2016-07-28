angular.module('octobluApp')
.controller('FlowController', function ( $q, $timeout, $interval, $log, $state, $rootScope, $stateParams, $scope, $window, $cookies, $debug, AuthService, BatchMessageService, FlowEditorService, FlowService, FlowNodeTypeService, NodeTypeService, reservedProperties, BluprintService, NotifyService, FlowNodeDimensions, FlowModel, ThingService, CoordinatesService, UUIDService, NodeRegistryService, SERVICE_UUIDS, FirehoseService, MeshbluHttpService, RegistryService) {
  var originalNode;
  var undoBuffer = [];
  var redoBuffer = [];
  var undid = false;
  var lastDeployedHash;
  var progressId;
  var currentFlow;
  var debug = $debug('octoblu:FlowController');

  $scope.zoomLevel = 0;
  $scope.debugLines = [];
  $scope.deployProgress = 0;
  $scope.documentHidden = false;
  $scope.loading = true;

  $scope.flowSelectorHeight = $($window).height() - 100;
  $($window).resize(function(){
    $scope.flowSelectorHeight = $($window).height() - 100;
  });

  FirehoseService.connect({uuid: $cookies.meshblu_auth_uuid}, function(error){
    if (error) {
      NotifyService.notify('Unable to connect to the Firehose');
    }
  });

  function updateFlowDeviceImmediately(data) {
    $scope.flowDevice = data;
  }

  var updateFlowDevice = _.throttle(updateFlowDeviceImmediately, 500, {leading: false, trailing: true});

  var visibilityChanged = function(){
    $scope.documentHidden = document.hidden;
    pulseKeepalive();
  }

  if(document.addEventListener) document.addEventListener("visibilitychange", visibilityChanged);

  var pulseKeepalive = function() {
    if ($scope.documentHidden) return debug("Tab not in the foreground, no subscribe:pulse");
    if (!$scope.activeFlow) return debug("No active flow, no subscribe:pulse");;
    debug('subscribe:pulse');
    MeshbluHttpService.message({devices: [$scope.activeFlow.flowId], topic: 'subscribe:pulse'}, _.noop);
  }

  $interval(pulseKeepalive, 60*1000);
  $scope.$watch('activeFlow', pulseKeepalive);

  var setCookie = function(flowId) {
    deleteCookie();
    $cookies.currentFlowId = flowId;
  };

  var deleteCookie = function() {
    delete $cookies.currentFlowId;
  };

  var checkDeviceStatus = function() {
    var query = {owner: $cookies.meshblu_auth_uuid, type: 'octoblu:flow'};
    var projection = {uuid: true, online: true};
    MeshbluHttpService.search({query: query, projection: projection}, function(error, devices) {
      if (error) {
        return;
      }
      _.each(devices, function(device){
        var flow = _.findWhere($scope.flows, {flowId: device.uuid});
        if (flow) {
          flow.online = device.online;
        }
      });
    });
  };

  FlowNodeTypeService.getFlowNodeTypes()
    .then(function (flowNodeTypes) {
      $scope.flowNodeTypes = flowNodeTypes;
    });

  NodeTypeService.getUnconfiguredNodeTypes()
    .then(function (nodeTypes) {
      $scope.nodeTypes = nodeTypes;
    });

  var refreshFlows = function () {
    return FlowService.getAllFlows().then(function (flows) {
      $scope.flows = flows;
    });
  };

  var mergeFlowNodeType = function(node) {
    return FlowNodeTypeService.getFlowNodeTypeByUUID(node.uuid).then(function(flowNodeType) {
      if (!flowNodeType) {
        return FlowNodeTypeService.getFlowNodeType(node.type);
      }
      return flowNodeType;
    }).then(function(flowNodeType) {
      if (flowNodeType) {
        node = _.extend({}, flowNodeType, node);
      }
      return node;
    });
  };

  var mergeFlowNodeTypes = function(flow) {
    var promises = _.map(flow.nodes, mergeFlowNodeType);
    $q.all(promises).then(function(nodes) {
      flow.nodes = nodes;
      flow.hashable = true;
    });
  };

  FlowService.getFlow($stateParams.flowId).then(function(activeFlow){
    deleteCookie();

    if(!activeFlow){
      $state.go('material.design');
      return;
    }

    $q.all([
      refreshFlows(),
      checkDeviceStatus(),
      mergeFlowNodeTypes(activeFlow)
    ]).then(function(){
      $scope.loading = false;
      $scope.setActiveFlow(activeFlow);
      FirehoseService.removeAllListeners();

      FirehoseService.on('configure.sent.' + activeFlow.flowId, function(message){
        updateFlowDevice(message.data);
      });

      FirehoseService.on('broadcast.**', function(message){
        var data = message.data;
        var metadata = message.metadata;
        if (data.topic === 'device-status') {
          if (data.payload) {
            var hop = _.first(metadata.route);
            if (hop) {
              var uuid = hop.from;
              var nodes = _.where(activeFlow.nodes, {uuid: uuid});
              _.each(nodes, function(node){
                node.online = data.payload.online;
              });
            }
          }
        }
      });

      FirehoseService.on('broadcast.*.' + activeFlow.flowId, function(message){
        var data = message.data;
        if (data.topic === 'message-batch') {
          if (data.payload) {
            BatchMessageService.parseMessages(data.payload.messages, $scope);
          }
        }
      });
    });
  });

  function escapeLargeValue(value){
    var str = JSON.stringify(value);
    if(str && str.length > 100000 ) {
      return '...value too long...';
    }

  	return value;
  }

  function pushDebugLines(message){
    var debug = {}, newMessage, msg;
    debug.date = new Date();
    newMessage = _.clone(message);
  	newMessage.msg = escapeLargeValue(newMessage.msg);
    debug.message = newMessage;
    $scope.debugLines.unshift(debug);
    if ($scope.debugLines.length > 100) {
      $scope.debugLines.pop();
    }
  }

  $scope.$on('flow-node-debug', function (event, options) {
    pushDebugLines(options.message);
  });

  $scope.$on('flow-node-error', function(event, options) {
    pushDebugLines(options.message);
    if(options.node) {
      options.node.errorMessage = options.message.msg;
    }
  });

  $scope.$on('flow-node-delete', function(e, node){
    $scope.activeFlow.selectedFlowNode = node;
    $scope.deleteSelection(e);
  })

  $scope.$on('flow-node-type-selected', function(event, flowNodeType){
    $scope.omniSearch = flowNodeType;
  });

  $scope.addFlow = function () {
    return FlowService.createFlow()
      .then(function(newFlow){
        $state.go('material.flow', {flowId: newFlow.flowId});
        NotifyService.notify('Flow Created');
      })
      .catch(function(error){
        NotifyService.alert({title: 'Flow Create Failed', content: 'Message: ' + error.message});
      });
  };

  $scope.getActiveFlow = function(){
    return FlowService.getActiveFlow();
  };

  $scope.setActiveFlow = function (flow) {
    ThingService.getThing({uuid: flow.flowId}).then(function(device){
      $scope.flowDevice = device;
    });
    $scope.activeFlow = flow;
    setCookie(flow.flowId);
    FlowService.setActiveFlow($scope.activeFlow);
  };

  $scope.isActiveFlow = function (flow) {
    return flow === $scope.activeFlow;
  };

  $scope.deleteFlow = function (flow) {
    var name = flow.name || flow.flowId;
    NotifyService.confirm({
      title: 'Delete Flow',
      content: 'Are you sure you want to delete ' + name + '?'
    }).then(function(){
      deleteCookie();
      FlowService.deleteFlow(flow.flowId).then(function(){
        $state.go('material.design');
      }).catch(function(error){
        NotifyService.alert({title: 'Flow Deploy Failed', content: 'Message: ' + error.message});
      });
    });
  };

  var debouncedToggle = _.debounce(function(){
    $scope.flowDropDownIsOpen = !$scope.flowDropDownIsOpen;
  }, 100, {leading: true, trailing: false});

  $scope.toggleDropdown = function($event){
    $event.preventDefault();
    $event.stopPropagation();
    debouncedToggle();
  };

  $scope.copySelection = function (e) {
    if ($scope.activeFlow &&
        $scope.activeFlow.selectedFlowNode &&
        $scope.activeFlow.selectedFlowNode.id) {
      $scope.copiedNode = JSON.stringify($scope.activeFlow.selectedFlowNode);
    }
  };

  $scope.cutSelection = function (e) {
    if (e) {
      e.preventDefault();
    }

    if (!$scope.activeFlow) {
      return;
    }

    $scope.copiedNode = JSON.stringify($scope.activeFlow.selectedFlowNode);
    FlowEditorService.deleteSelection($scope.activeFlow);
  };

  $scope.undoEdit = function(e) {
    if(e) {
      e.preventDefault();
    }

    var oldFlow = undoBuffer.pop();
    if (!oldFlow) return;

    undid = true;
    addToBuffer(_.cloneDeep($scope.activeFlow), redoBuffer);
    FlowService.setActiveFlow(oldFlow);
    $scope.activeFlow = oldFlow;
  };

  $scope.redoEdit = function(e) {
    if(e) {
      e.preventDefault();
    }

    var oldFlow = redoBuffer.pop();
    if (!oldFlow) return;

    undid = true;
    addToBuffer(_.cloneDeep($scope.activeFlow), undoBuffer);
    $scope.activeFlow = oldFlow;
    FlowService.setActiveFlow(oldFlow);
  }

  $scope.undoable = function() {
    return undoBuffer.length > 0;
  }

  $scope.redoable = function() {
    return redoBuffer.length > 0;
  }

  $scope.deleteSelection = function (e) {
    if (e) {
      e.preventDefault();
    }

    if (!$scope.activeFlow) {
      return;
    }

    FlowEditorService.deleteSelection($scope.activeFlow);
  };

  $scope.pasteSelection = function (e) {
    if (e) {
      e.preventDefault();
    }

    if (!$scope.activeFlow || !$scope.copiedNode) {
      return;
    }

    var node = JSON.parse($scope.copiedNode);
    delete node.x;
    delete node.y;

    if (_.isNumber($scope.currentMouseX) && _.isNumber($scope.currentMouseY)) {
      var svgElement = $(".flow-editor-workspace")[0];
      if (svgElement) {
        var loc = CoordinatesService.transform(svgElement, $scope.currentMouseX, $scope.currentMouseY);
        node.x = loc.x - FlowNodeDimensions.width/2;
        node.y = loc.y - FlowNodeDimensions.minHeight/2;
      }
    }

    node.id = UUIDService.v1();
    $scope.activeFlow.nodes.push(node);

    $scope.activeFlow.selectedFlowNode = null;
    $scope.activeFlow.selectedLink = null;
  };

  $scope.zoomIn = function (e) {
    $scope.$broadcast('zoomIn');
  };

  $scope.zoomOut = function (e) {
    $scope.$broadcast('zoomOut');
  };

  $scope.center = function () {
    $scope.$broadcast('centerViewBox');
  };

  $scope.immediateSave = function (e) {
    if (e) {
      e.preventDefault();
    }
    FlowService.saveActiveFlow();
  };

  $scope.save = _.throttle($scope.immediateSave, 1000);

  $scope.setMousePosition = function (e) {
    if (!$scope.activeFlow) {
      return;
    }
    $scope.currentMouseX = e.clientX;
    $scope.currentMouseY = e.clientY;
  };

  $scope.focusDesigner = function () {
    document.getElementById("designer").focus();
  };

  $scope.clearMousePosition = function () {
    $scope.currentMouseX = null;
    $scope.currentMouseY = null;
  };

  $scope.createBluprint = function(flow) {
    BluprintService.createBluprint({name: flow.name, flowId: flow.flowId}).then(function(template) {
      $state.go('material.bluprintEdit', {bluprintId: template.uuid});
    });
  };

  var unselectSelectedFlowNode = function() {
    $scope.activeFlow.selectedFlowNode = null;
  };

  $scope.toggleSidebarView = function() {
    $scope.sidebarIsExpanded = !$scope.sidebarIsExpanded;
    if (!$scope.sidebarIsExpanded) {
      _.delay(unselectSelectedFlowNode, 100);
    }
  };

  var immediateCalculateFlowHash = function(newFlow) {
    if (!newFlow || !newFlow.hashable) { return; }
    newFlow = _.cloneDeep(newFlow);
    newFlow.hash = FlowService.hashFlow(newFlow);
    newFlow.minHash = FlowService.minimalFlow(newFlow).minHash;

    if (!undid && currentFlow &&
      currentFlow.minHash !== newFlow.minHash &&
      addToBuffer(currentFlow, undoBuffer)) {
      redoBuffer = [];
    }
    compareFlowHash(newFlow, currentFlow);

    if (undid){
      undid = false;
    }
    currentFlow = newFlow
  };

  var calculateFlowHash =  _.debounce(immediateCalculateFlowHash, 500);

  var addToBuffer = function(flow, buffer) {
    var lastIndex = buffer.length-1;
    var lastFlow = buffer[lastIndex] || {};

    flow.selectedLink = null;
    flow.selectedFlowNode = null;

    if (!flow.minHash) {
      flow.minHash = FlowService.minimalFlow(flow).minHash;
    }
    if (flow.minHash === lastFlow.minHash) {
      buffer[lastIndex] = flow;
      return false;
    }
    buffer.push(flow);
    return true;
  }

  var compareFlowHash = function(newFlow, oldFlow) {
    if (!newFlow || !oldFlow) { return; }
    if (!newFlow.hash){
      newFlow.hash = FlowService.hashFlow(newFlow);
    }
    if (!oldFlow.hash){
      oldFlow.hash = FlowService.hashFlow(oldFlow);
    }
    if (_.isEqual(newFlow.hash, oldFlow.hash)) { return }
    $scope.needsToBeDeployed = lastDeployedHash !== newFlow.hash;
    FlowService.saveActiveFlow();
  };

  var expandSidebarIfNodeType = function(nodeType) {
    if(!nodeType) return;
    if(!nodeType.id) {
      $scope.sidebarIsExpanded = true;
    }
  };

  var watchNodes = function(newNodes) {
    var flow = $scope.activeFlow;
    if(!flow) {
      return;
    }
    subscribeFlowToDevices(newNodes);
    return FlowNodeTypeService.getFlowNodeTypes().then(function(flowNodeTypes){
      _.each(newNodes, function(node){
        if(node.type === 'operation:device'){
          return;
        }
        node.needsConfiguration = !_.findWhere(flowNodeTypes, {uuid: node.uuid});
        node.needsSetup         = !_.findWhere(flowNodeTypes, {type: node.type});

        if(node.needsConfiguration && !node.needsSetup){
          var matchingNode = _.findWhere(flowNodeTypes, {type: node.type});

          if (matchingNode && matchingNode.defaults) {
            node.channelActivationId = matchingNode.defaults.channelActivationId;
            node.uuid                = matchingNode.defaults.uuid;
            node.token               = matchingNode.defaults.token;
          }
          node.needsConfiguration  = false;
        }
      });
    });
  };

  var flowDeployingInterval;
  var flowStoppingInterval;

  var checkFlowDeploying = function(){
    ThingService.getThing({uuid: $scope.flowDevice.uuid})
      .then(function(flow){
        $scope.flowDevice.deploying = flow.deploying;
        $scope.flowDevice.stopping  = flow.stopping;
        $scope.flowDevice.online = flow.online;
      })
      .catch(function(error){
        $interval.cancel(flowDeployingInterval);
        $interval.cancel(flowStoppingInterval);
        flowDeployingInterval = undefined;
        flowStoppingInterval = undefined;
        NotifyService.notifyError(error);
      });
  }

  var watchFlowDeployingImmediate = function(deploying){
    if (!deploying) {
      $interval.cancel(flowDeployingInterval);
      flowDeployingInterval = undefined;
      return;
    }
    if (deploying) {
      if (flowDeployingInterval) {
        return;
      }
      flowDeployingInterval = $interval(checkFlowDeploying, 1000);
    }
  };

  var watchFlowStoppingImmediate = function(stopping){
    if (!stopping) {
      $interval.cancel(flowStoppingInterval);
      flowStoppingInterval = undefined;
      return;
    }
    if (stopping) {
      if (flowStoppingInterval) {
        return;
      }
      flowStoppingInterval = $interval(checkFlowDeploying, 1000);
    }
  };

  var watchFlowDeploying = _.throttle(watchFlowDeployingImmediate, 1000, {leading: false, trailing: true});
  var watchFlowStopping = _.throttle(watchFlowStoppingImmediate, 1000, {leading: false, trailing: true});

  var subscribeFlowToDevices = function(newNodes){
    var deviceNodes = _.filter(newNodes, function(node){
      return node.meshblu || node.class === 'device-flow';
    });
    var deviceNodeUuids = _.pluck(deviceNodes, 'uuid');
    return FlowService.subscribeFlowToDevices($scope.activeFlow.flowId, deviceNodeUuids);
  };

  $scope.$watch('activeFlow', calculateFlowHash, true);
  $scope.$watchCollection('activeFlow.nodes', watchNodes);
  $scope.$watch('activeFlow.selectedFlowNode', expandSidebarIfNodeType);
  $scope.$watch('flowDevice.deploying', watchFlowDeploying);
  $scope.$watch('flowDevice.stopping', watchFlowStopping);
});
