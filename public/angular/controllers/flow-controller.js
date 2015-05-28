angular.module('octobluApp')
.controller('FlowController', function ( $log, $state, $stateParams, $scope, $window, $cookies, AuthService, FlowEditorService, FlowService, FlowNodeTypeService, NodeTypeService, skynetService, reservedProperties, BluprintService, NotifyService) {
  var originalNode;
  var undoBuffer = [];
  var redoBuffer = [];
  var undid = false;
  var lastDeployedHash;
  $scope.zoomLevel = 0;
  $scope.debugLines = [];
  $scope.deviceOnline = false;

  $scope.flowSelectorHeight = $($window).height() - 100;
  $($window).resize(function(){
    $scope.flowSelectorHeight = $($window).height() - 100;
  });

  var subscribeToFlow = function(skynetConnection, flowId){
    skynetConnection.subscribe({uuid: flowId, topic: 'pulse'});
    deadManSwitch(skynetConnection, flowId);
  };

  var deadManSwitch = function(skynetConnection, flowId) {
    skynetConnection.message({devices: [flowId], topic: 'subscribe:pulse'});
    _.delay(function() {
      deadManSwitch(skynetConnection, flowId);
    }, 60 * 1000)
  };

  var setCookie = function(flowId) {
    $cookies.currentFlowId = flowId;
  };

  var deleteCookie = function() {
    delete $cookies.currentFlowId;
  };

  var setDeviceStatus = function(status) {
    $scope.activeFlow.deployed = status;
    $scope.deviceOnline = status;
    $scope.deploying = false;
    $scope.stopping = false;
  };

  var checkDeviceStatus = function(skynetConnection, flowId) {
    skynetConnection.mydevices({}, function(result){
      _.each($scope.flows, function(flow) {
        var device = _.findWhere(result.devices, {uuid: flow.flowId});
        if (device) {
          flow.online = device.online;
          if (device.uuid === flowId) {
            setDeviceStatus(device.online);
          }
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

  refreshFlows().then(function(){
    deleteCookie();
    var activeFlow = _.findWhere($scope.flows, {flowId: $stateParams.flowId});

    if(!activeFlow){
      $state.go('material.design');
      return;
    }

    $scope.setActiveFlow(activeFlow);

    skynetService.getSkynetConnection().then(function (skynetConnection) {

      subscribeToFlow(skynetConnection, $stateParams.flowId);
      checkDeviceStatus(skynetConnection, $stateParams.flowId);

      skynetConnection.on('message', function (message) {
        if(message.fromUuid !== $stateParams.flowId) {
          return;
        }

        if (message.topic === 'device-status') {
          setDeviceStatus(message.payload.online);
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
    $log.debug(options);
    pushDebugLines(options.message);
    $scope.$apply();
  });

  $scope.$on('flow-node-error', function(event, options) {
    $log.debug(options);
    if(!options.node) {
      return;
    }
    pushDebugLines(options.message);
    options.node.errorMessage = options.message.msg;
    $scope.$apply();
  });

  $scope.$on('flow-node-type-selected', function(event, flowNodeType){
    $scope.omniSearch = flowNodeType;
  });

  $scope.addFlow = function () {
    return FlowService.createFlow()
      .then(function(newFlow){
        $state.go('material.flow', {flowId: newFlow.flowId});
      })
      .catch(function(error){
        console.error(error);
      });
  };

  $scope.getActiveFlow = function(){
    return FlowService.getActiveFlow();
  };

  $scope.setActiveFlow = function (flow) {
    $scope.activeFlow = flow;
    setCookie(flow.flowId);
    FlowService.setActiveFlow($scope.activeFlow);
  };

  $scope.isActiveFlow = function (flow) {
    return flow === $scope.activeFlow;
  };

  $scope.deleteFlow = function (flow) {
    NotifyService.confirm({
      title: 'Delete Flow',
      content: 'Are you sure you want to delete ' + flow.name + '?'
    }).then(function(){
      deleteCookie();
      FlowService.deleteFlow(flow.flowId).then(function(){
        $state.go('material.design');
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
    if ($scope.activeFlow && $scope.activeFlow.selectedFlowNode) {
      $scope.copiedNode = JSON.stringify($scope.activeFlow.selectedFlowNode);
    }
  };

  $scope.cutSelection = function (e) {
    if (e) {
      e.preventDefault();
    }
    if ($scope.activeFlow) {
      $scope.copiedNode = JSON.stringify($scope.activeFlow.selectedFlowNode);
      _.pull($scope.activeFlow.nodes, $scope.activeFlow.selectedFlowNode);
    }

    if ($scope.activeFlow) {
      _.pull($scope.activeFlow.links, $scope.activeFlow.selectedLink);
    }

    $scope.activeFlow.selectedFlowNode = null;
    $scope.activeFlow.selectedLink = null;
  };

  $scope.undoEdit = function(e) {
    if(e) {
      e.preventDefault();
    }

    if(!undoBuffer.length) {
     return;
    }

    redoBuffer.push($scope.activeFlow);
    var oldFlow =  undoBuffer.pop();
    undid = true;
    FlowService.setActiveFlow(oldFlow);

    $scope.activeFlow = oldFlow;
  }

  $scope.redoEdit = function(e) {
    if(e) {
      e.preventDefault();
    }

    if(!redoBuffer.length) {
      return;
    }

    undoBuffer.push($scope.activeFlow);
    var oldFlow = redoBuffer.pop();
    undid = true;
    $scope.activeFlow = oldFlow;
    FlowService.setActiveFlow(oldFlow);
  }

  $scope.undoable = function() {
    return undoBuffer.length > 0;
  }

  $scope.redoable = function() {
    return redoBuffer.length > 0;
  }

  $scope.immediateStart = function (e) {
    if (e) {
      e.preventDefault();
    }
    lastDeployedHash = _.clone($scope.activeFlow.hash);
    $scope.needsToBeDeployed = false;
    $scope.deploying = true;
    _.each($scope.activeFlow.nodes, function(node) {
      delete node.errorMessage;
    });
    FlowService.start();
  };

  $scope.start = _.throttle($scope.immediateStart, 5000);

  $scope.immediateStop = function (e) {
    if (e) {
      e.preventDefault();
    }
    $scope.stopping = true;
    $scope.needsToBeDeployed = true;
    FlowService.stop();
  };

  $scope.stop = _.throttle($scope.immediateStop, 5000);

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
    if ($scope.activeFlow && $scope.copiedNode) {
      var node = JSON.parse($scope.copiedNode);
      if ($scope.currentMouseX) {
        node.x = $scope.currentMouseX;
      }
      if ($scope.currentMouseY) {
        node.y = $scope.currentMouseY;
      }
      $scope.activeFlow.addNode(node);
    }

    $scope.activeFlow.selectedFlowNode = null;
    $scope.activeFlow.selectedLink = null;
  };

  $scope.zoomIn = function (e) {
    if (e) {
      e.preventDefault();
    }
    if ($scope.activeFlow.zoomScale + 0.25 <= 2) {
      $scope.activeFlow.zoomScale += 0.25;
    }
  };

  $scope.zoomOut = function (e) {
    if (e) {
      e.preventDefault();
    }
    if ($scope.activeFlow.zoomScale - 0.25 >= 0.25) {
      $scope.activeFlow.zoomScale -= 0.25;
    }
  };

  $scope.center = function () {
    $scope.activeFlow.zoomScale = 1;
    $scope.activeFlow.zoomX = 0;
    $scope.activeFlow.zoomY = 0;

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
    $scope.currentMouseX = e.offsetX / $scope.activeFlow.zoomScale;
    $scope.currentMouseY = e.offsetY / $scope.activeFlow.zoomScale;
  };

  $scope.clearMousePosition = function () {
    $scope.currentMouseX = null;
    $scope.currentMouseY = null;
  };

  $scope.createBluprint = function(flow) {
    BluprintService.createBluprint({name: flow.name, flowId: flow.flowId}).then(function(template) {
      $state.go('material.bluprint', {templateId: template.uuid});
    });
  };

  var immediateCalculateFlowHash = function(newFlow, oldFlow) {
    if(!newFlow){
      return;
    }
    newFlow.hash = FlowService.hashFlow(newFlow);
    addToUndoBuffer(oldFlow);
    // $scope.$apply();
  };

  var addToUndoBuffer = function(oldFlow) {

    if(undid){
      undid = false;
      return;
    }

    redoBuffer = [];
    undoBuffer.push(oldFlow);
  };

  var calculateFlowHash = _.debounce(immediateCalculateFlowHash, 500);

  var compareFlowHash = function(newHash, oldHash){
    if (!oldHash) {
      return;
    }
    if (_.isEqual(newHash, oldHash)) { return }
    $scope.needsToBeDeployed = lastDeployedHash !== newHash

    FlowService.saveActiveFlow();
  };

  $scope.$watch('activeFlow', calculateFlowHash, true);
  $scope.$watch('activeFlow.hash', compareFlowHash);

  $scope.$on('update-active-flow-edit', function(event, newFlow){
    var flow = _.pick(newFlow, ['links', 'nodes', 'name']);
    $scope.setActiveFlow(angular.extend($scope.activeFlow, flow));
  });
});
