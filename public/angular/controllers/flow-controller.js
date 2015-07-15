angular.module('octobluApp')
.controller('FlowController', function ( $timeout, $interval, $log, $state, $stateParams, $scope, $window, $cookies, AuthService, FlowEditorService, FlowService, FlowNodeTypeService, NodeTypeService, skynetService, reservedProperties, BluprintService, NotifyService, FlowNodeDimensions, FlowModel, ThingService, CoordinatesService, UUIDService) {
  var originalNode;
  var undoBuffer = [];
  var redoBuffer = [];
  var undid = false;
  var lastDeployedHash;
  var progressId;
  $scope.zoomLevel = 0;
  $scope.debugLines = [];
  $scope.deviceOnline = false;
  $scope.deployProgress = 0;

  $scope.flowSelectorHeight = $($window).height() - 100;
  $($window).resize(function(){
    $scope.flowSelectorHeight = $($window).height() - 100;
  });

  var subscribeToFlow = function(skynetConnection, flowId){
    if (!_.findWhere(skynetConnection.subscriptions, {uuid: flowId})) {
      skynetConnection.subscribe({uuid: flowId, topic: 'pulse', types: ['received', 'broadcast']});
    }
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

      skynetConnection.on('config', function(data){
        if(data.uuid !== $stateParams.flowId) {
          return;
        }

        $scope.flowDevice = data;
      });

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
    ThingService.getThing({uuid: flow.flowId}).then(function(device){
      $scope.flowDevice = device;
    });
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

    if(!undoBuffer.length) {
     return;
    }

    redoBuffer.push($scope.activeFlow);
    var oldFlow =  undoBuffer.pop();
    undid = true;
    FlowService.setActiveFlow(oldFlow);

    $scope.activeFlow = oldFlow;
  };

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
    }

    $scope.activeFlow.selectedFlowNode = null;
    $scope.activeFlow.selectedLink = null;
  };

  $scope.zoomIn = function (e) {
    if (e) {
      e.preventDefault();
    }
    $scope.activeFlow.zoomScale *= 1.25;
    if ($scope.activeFlow.zoomScale > 8) {
      $scope.activeFlow.zoomScale = 8;
    }
  };

  $scope.zoomOut = function (e) {
    if (e) {
      e.preventDefault();
    }
    $scope.activeFlow.zoomScale /= 1.25;
    if ($scope.activeFlow.zoomScale < 0.01) {
      $scope.activeFlow.zoomScale = 0.01;
    }
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

  $scope.clearMousePosition = function () {
    $scope.currentMouseX = null;
    $scope.currentMouseY = null;
  };

  $scope.createBluprint = function(flow) {
    BluprintService.createBluprint({name: flow.name, flowId: flow.flowId}).then(function(template) {
      $state.go('material.bluprint', {templateId: template.uuid});
    });
  };

  var unselectSelectedFlowNode = function() {
    $scope.activeFlow.selectedFlowNode = null;
  }

  $scope.toggleSidebarView = function() {
    $scope.sidebarIsExpanded = !$scope.sidebarIsExpanded;
    if (!$scope.sidebarIsExpanded) {
      _.delay(unselectSelectedFlowNode, 500);
    }
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

  var expandSidebarIfNodeType = function(nodeType) {
    if(!nodeType) return;
    if(nodeType.resourceType === 'node-type') {
      return $scope.sidebarIsExpanded = true;
    }
  }

  $scope.$watch('activeFlow', calculateFlowHash, true);
  $scope.$watch('activeFlow.hash', compareFlowHash);

  $scope.$watch('activeFlow.selectedFlowNode', expandSidebarIfNodeType);

});
