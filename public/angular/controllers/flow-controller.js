angular.module('octobluApp')
  .controller('FlowController', function ( $log, $state, $stateParams, $scope, $window, AuthService, FlowService, FlowNodeTypeService, NodeTypeService, skynetService, reservedProperties) {
    var originalNode;

    $scope.zoomLevel = 0;
    $scope.debugLines = [];
    $scope.deviceOnline;

    $scope.flowSelectorHeight = $($window).height() - 100;
    $($window).resize(function(){
      $scope.flowSelectorHeight = $($window).height() - 100;
    });

    var subscribeToFlow = function(skynetConnection, flowId){
      skynetConnection.subscribe({uuid: flowId, type: 'octoblu:flow', topic: 'pulse'});
    };

    var setDeviceStatus = function(status) {
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
          }
          if (device.uuid === flowId) {
            setDeviceStatus(device.online);
          }
        });
      });
    };

    skynetService.getSkynetConnection().then(function (skynetConnection) {
      skynetConnection.on('ready', function(){
        subscribeToFlow(skynetConnection, $stateParams.flowId);
        checkDeviceStatus(skynetConnection, $stateParams.flowId);
      });

      subscribeToFlow(skynetConnection, $stateParams.flowId);
      checkDeviceStatus(skynetConnection, $stateParams.flowId);

      skynetConnection.on('message', function (message) {
        if (message.topic === 'device-status') {
          setDeviceStatus(message.payload.online);
        }
      });
    });

    FlowNodeTypeService.getFlowNodeTypes()
      .then(function (flowNodeTypes) {
        $scope.flowNodeTypes = flowNodeTypes;
      });

    NodeTypeService.getNodeTypes()
      .then(function (nodeTypes) {
        $scope.nodeTypes = nodeTypes;
      });

    var refreshFlows = function () {
      return FlowService.getAllFlows().then(function (flows) {
        $scope.flows = flows;
      });
    };

    refreshFlows().then(function(){
      var activeFlow = _.findWhere($scope.flows, {flowId: $stateParams.flowId});
      if(activeFlow){
        return $scope.setActiveFlow(activeFlow);
      }
      $state.go('design');
    });

    $scope.logout = function(){
      AuthService.logout()
        .then(function () {
          $state.go('login');
        });
    };

    function escapeLargeValue(value){
    	var maxLength = 500;
			if( value && value.length > maxLength){
    		return '...value to long...';
    	}
    	return value;
    }

    function pushDebugLines(message){
      var debug = {}, newMessage, msg;
      debug.date = new Date();
      newMessage = _.clone(message);
      if(newMessage.msg){
      	if(_.isArray(newMessage.msg)){
		      newMessage.msg = _.map(newMessage.msg, function(value){
		      	return _.mapValues(value, escapeLargeValue);
		      });
      	}else if(_.isObject(newMessage.msg)){
		      newMessage.msg = _.mapValues(newMessage.msg, escapeLargeValue);
      	}
	    }
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
      pushDebugLines(options.message);
      options.node.errorMessage = options.message.msg;
      $scope.$apply();
    });

    $scope.$on('flow-node-type-selected', function(event, flowNodeType){
      $scope.omniSearch = flowNodeType;
    });

    $scope.addFlow = function () {
      return FlowService.createFlow().then(function(newFlow){
        $state.go('flow', {flowId: newFlow.flowId});
      });
    };

    $scope.getActiveFlow = function(){
      return FlowService.getActiveFlow();
    };

    $scope.setActiveFlow = function (flow) {
      $scope.activeFlow = flow;
      FlowService.setActiveFlow($scope.activeFlow);
    };

    $scope.isActiveFlow = function (flow) {
      return flow === $scope.activeFlow;
    };

    $scope.deleteFlow = function (flow) {
      var deleteFlowConfirmed = $window.confirm('Are you sure you want to delete ' + flow.name + '?');
      if (deleteFlowConfirmed) {
        FlowService.deleteFlow(flow.flowId).then(function(){
          $state.go('design');
        });
      }
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

    $scope.immediateStart = function (e) {
      if (e) {
        e.preventDefault();
      }
      $scope.deploying = true;
      _.each($scope.activeFlow.nodes, function(node) {
        delete node['errorMessage'];
      });
      FlowService.start();
    };

    $scope.start = _.throttle($scope.immediateStart, 5000);

    $scope.immediateStop = function (e) {
      if (e) {
        e.preventDefault();
      }
      $scope.stopping = true;
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

      _.pull($scope.activeFlow.nodes, $scope.activeFlow.selectedFlowNode);
      _.pull($scope.activeFlow.links, $scope.activeFlow.selectedLink);

      $scope.activeFlow.selectedFlowNode = null;
      $scope.activeFlow.selectedLink = null;
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

    var immediateCalculateFlowHash = function(newFlow, oldFlow) {
      if(! newFlow){
        return;
      }
      newFlow.hash = FlowService.hashFlow(newFlow);
      $scope.$apply();
    };

    var calculateFlowHash = _.debounce(immediateCalculateFlowHash, 500);

    var compareFlowHash = function(newHash, oldHash){
      if (!oldHash) {
        return;
      }
      if (!_.isEqual(newHash, oldHash)) {
        FlowService.saveActiveFlow();
      }
    };

    $scope.$watch('activeFlow', calculateFlowHash, true);
    $scope.$watch('activeFlow.hash', compareFlowHash);

    $scope.$on('update-active-flow-edit', function(event, newFlow){
      var flow = _.pick(newFlow, ['links', 'nodes', 'name']);
      $scope.setActiveFlow(angular.extend($scope.activeFlow, flow));
    });
  });
