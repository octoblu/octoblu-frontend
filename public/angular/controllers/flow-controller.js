angular.module('octobluApp')
.controller('FlowController', function ( $q, $timeout, $interval, $log, $state, $stateParams, $scope, $window, $cookies, AuthService, BatchMessageService, FlowEditorService, FlowService, FlowNodeTypeService, NodeTypeService, reservedProperties, BluprintService, NotifyService, FlowNodeDimensions, FlowModel, ThingService, CoordinatesService, UUIDService, NodeRegistryService, SERVICE_UUIDS, FirehoseService, MeshbluHttpService, UserSubscriptionService) {
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
  $scope.documentHidden = false;

  $scope.flowSelectorHeight = $($window).height() - 100;
  $($window).resize(function(){
    $scope.flowSelectorHeight = $($window).height() - 100;
  });

  FirehoseService.connect({uuid: $cookies.meshblu_auth_uuid}, function(error){
    if (error) {
      NotifyService.notify('Unable to connect to the Firehose');
    }
  });

  var createFlowSubscriptions = function(flowId){
    async.series([
      async.apply(UserSubscriptionService.createSubscriptions, {emitterUuid: $cookies.meshblu_auth_uuid, types: ['broadcast.received', 'configure.received']}),
      async.apply(UserSubscriptionService.createSubscriptions, {emitterUuid: flowId, types: ['broadcast.sent', 'configure.sent', 'broadcast.received']})
    ]);
  };

  function updateFlowDeviceImmediately(data) {
    $scope.flowDevice = data;
  }

  var updateFlowDevice = _.throttle(updateFlowDeviceImmediately, 500, {leading: false, trailing: true});

  var visibilityChanged = function(){
    $scope.documentHidden = document.hidden;
  }

  if(document.addEventListener) document.addEventListener("visibilitychange", visibilityChanged);

  var deadManSwitch = function(flowId) {
    if (!$scope.documentHidden) {
      MeshbluHttpService.message({devices: [flowId], topic: 'subscribe:pulse'}, _.noop);
    }
    _.delay(function() {
      deadManSwitch(flowId);
    }, 60 * 1000)
  };

  var setCookie = function(flowId) {
    deleteCookie();
    $cookies.currentFlowId = flowId;
  };

  var deleteCookie = function() {
    delete $cookies.currentFlowId;
  };

  var setDeviceStatus = function(status) {
    $scope.activeFlow.deployed = status;
    $scope.deviceOnline = status;
  };

  var checkDeviceStatus = function(flowId) {
    MeshbluHttpService.devices({owner: $cookies.meshblu_auth_uuid}, function(error, result) {
      _.each($scope.flows, function(flow) {
        var device = _.findWhere(result, {uuid: flow.flowId});
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

  FlowService.getFlow($stateParams.flowId).then(function(activeFlow){
    deleteCookie();

    if(!activeFlow){
      $state.go('material.design');
      return;
    }

    $scope.setActiveFlow(activeFlow);
    refreshFlows();

    createFlowSubscriptions(activeFlow.flowId);
    deadManSwitch(activeFlow.flowId);

    FirehoseService.on('configure.sent.' + activeFlow.flowId, function(message){
      updateFlowDevice(message.data);
    });

    FirehoseService.on('**.' + activeFlow.flowId, function(message){
      var data = message.data;
      if (data.topic === 'message-batch') {
        if (data.payload) {
          BatchMessageService.parseMessages(data.payload.messages, $scope);
        }
      }

      if (data.topic === 'device-status') {
        if (data.payload) {
          setDeviceStatus(data.payload.online);
        }
      }
    });

    checkDeviceStatus(activeFlow.flowId);
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
    $scope.$apply();
  });

  $scope.$on('flow-node-error', function(event, options) {
    pushDebugLines(options.message);
    if(options.node) {
      options.node.errorMessage = options.message.msg;
    }
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
        NotifyService.notify("Flow Created");
      })
      .catch(function(error){
        console.error(error);
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
    redoBuffer.push($scope.activeFlow);
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
    undoBuffer.push($scope.activeFlow);
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
  }

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

  var checkForServiceNames = function(uuids) {
    var newList = _.map(uuids, function(uuid){
      if(SERVICE_UUIDS.TRIGGER === uuid){
        return 'Trigger Service'
      }
      if(SERVICE_UUIDS.INTERVAL === uuid){
        return 'Interval Service'
      }
      if(SERVICE_UUIDS.CREDENTIALS === uuid){
        return 'Credential Service'
      }
      return uuid
    })
    return newList;
  }

  var askToAddReceiveAs = function(thingsNeedingReceiveAs) {
    var deviceList = _.map(thingsNeedingReceiveAs, function(thing){
      return thing.name || thing.uuid;
    });
    var options = {
      title: 'Permission Update Required',
      content: 'The following devices need to allow the flow to send and receive messages: ' + deviceList.join(', ')
    };
    return NotifyService.confirm(options);
  };

  var askToAddSendWhitelist = function(thingsNeedingSendWhitelist) {
    thingsNeedingSendWhitelist = checkForServiceNames(thingsNeedingSendWhitelist);
    var options = {
      title: 'Permission Update Required',
      content: 'The following devices need to send messages to your flow: ' + thingsNeedingSendWhitelist.join(', ')
    };
    return NotifyService.confirm(options);
  };

  var addFlowToWhitelists = function(thingsNeedingReceiveAs) {
    var deferred = $q.defer()

    async.eachSeries(thingsNeedingReceiveAs, function(thing, callback){
      var updateObj = {};
      updateObj.uuid = thing.uuid;
      updateObj.receiveAsWhitelist = thing.receiveAsWhitelist || [];
      updateObj.receiveAsWhitelist.push($scope.activeFlow.flowId);
      updateObj.receiveWhitelist = thing.receiveWhitelist || [];
      updateObj.receiveWhitelist.push($scope.activeFlow.flowId);
      updateObj.sendWhitelist = thing.sendWhitelist || [];
      updateObj.sendWhitelist.push($scope.activeFlow.flowId);
      ThingService.updateDevice(updateObj)
        .then(function(){ callback() })
        .catch(callback)
    }, function(error){
      if (error){
        return deferred.reject(error)
      }

      return deferred.resolve(thingsNeedingReceiveAs);
    });

    return deferred;
  };

  var addSendWhitelistsToFlow = function(thingsNeedingSendWhitelist) {
    ThingService.getThing({uuid: $scope.activeFlow.flowId}).then(function(thing) {
      thing.sendWhitelist = thing.sendWhitelist || [];
      thing.sendWhitelist = _.union(thing.sendWhitelist, thingsNeedingSendWhitelist);
      ThingService.updateDevice(thing);
    })
  };

  var askAndAddToReceiveAs = function(thingsNeedingReceiveAs) {
    return askToAddReceiveAs(thingsNeedingReceiveAs)
      .then(function(things){
        return addFlowToWhitelists(thingsNeedingReceiveAs);
      })
      .then(function(){
        return NotifyService.notify('Permissions updated');
      })
      .catch(function(){
        return NotifyService.notify('Permissions Not Updated');
      });
  };

  var askAndAddToSendWhitelist = function(thingsNeedingSendWhitelist) {
    return askToAddSendWhitelist(thingsNeedingSendWhitelist)
      .then(function(things){
        return addSendWhitelistsToFlow(thingsNeedingSendWhitelist);
      })
      .then(function(){
        return NotifyService.notify('Permissions updated');
      })
      .catch(function(){
        return NotifyService.notify('Permissions Not Updated');
      });
  };

  var checkDevicePermissions = function(newNodes) {
    var deviceNodes = _.filter(newNodes, function(node){
      return node.meshblu || node.class === 'device-flow';
    });

    var deviceUuids = _.pluck(deviceNodes, 'uuid');
    FlowService.needsPermissions($scope.activeFlow.flowId, deviceUuids)
      .then(function(thingsNeedingReceiveAs){
        if (_.isEmpty(thingsNeedingReceiveAs)){
          return;
        }
        return askAndAddToReceiveAs(thingsNeedingReceiveAs);
      });
  };

  var checkNodeRegistryPermissions = function(newNodes) {
    var deviceNodes = _.filter(newNodes, function(node){
      return node.meshblu || node.class === 'device-flow';
    });
    var nodeTypes = _.pluck(newNodes, 'type');
    NodeRegistryService.needsPermissions($scope.activeFlow.flowId, nodeTypes)
      .then(function(thingsNeedingSendWhitelist){
        if (_.isEmpty(thingsNeedingSendWhitelist)){
          return;
        }
        return askAndAddToSendWhitelist(thingsNeedingSendWhitelist);
      });
  };

  var watchNodes = function(newNodes) {
    if(!$scope.activeFlow) {
      return;
    }

    checkDevicePermissions(newNodes);
    checkNodeRegistryPermissions(newNodes);
    subscribeFlowToDevices(newNodes);
  }

  var subscribeFlowToDevices = function(newNodes){
    var deviceNodes = _.filter(newNodes, function(node){
      return node.meshblu || node.class === 'device-flow';
    });
    var deviceNodeUuids = _.pluck(deviceNodes, 'uuid');
    FlowService.subscribeFlowToDevices($scope.activeFlow.flowId, deviceNodeUuids);
  };

  $scope.$watch('activeFlow', calculateFlowHash, true);
  $scope.$watch('activeFlow.hash', compareFlowHash);
  $scope.$watchCollection('activeFlow.nodes', watchNodes);
  $scope.$watch('activeFlow.selectedFlowNode', expandSidebarIfNodeType);
});
