class FlowDeployButtonController
  constructor: ($scope, $http, AuthService, IotAppService, FlowService, FlowPermissionService, ThingService, NotifyService, MESHBLU_HOST, MESHBLU_PORT, $cookies) ->
    @scope = $scope
    @http = $http
    @FlowService = FlowService
    @IotAppService = IotAppService
    @ThingService = ThingService
    @cookies = $cookies
    @MESHBLU_HOST = MESHBLU_HOST
    @MESHBLU_PORT = MESHBLU_PORT
    @NotifyService = NotifyService
    @FlowPermissionService = FlowPermissionService

    @start = _.throttle @immediateStart, 1000, leading: true, trailing: false
    @stop = _.throttle @immediateStop, 1000, leading: true, trailing: false

    AuthService.getCurrentUser().then ({userDevice}) => @scope.beta = userDevice.octoblu.beta

  immediateStart : (e) =>
    e?.preventDefault()
    return @deployFlow() unless @scope.flow.pendingPermissions
    options =
      title: 'Permissions Update'
      content: 'In order to communicate with your devices, some permissions need to be updated.'
      ok: 'Update and Deploy'
      cancel: 'Deploy Without Update'
    permissionManager = @FlowPermissionService.createPermissionManager @scope.flow
    @NotifyService.confirm options
      .then permissionManager.updatePendingPermissions
      .catch => return
      .finally @deployFlow

  publishBluprint: =>
    @IotAppService.publish {flowId: @scope.device.uuid, appId: @scope.device.bluprint}

  deployFlow: =>
    lastDeployedHash = _.clone @scope.flow.hash
    _.each @scope.flow.nodes, (node) =>
      delete node.errorMessage

    @scope.device.deploying = true
    @scope.device.stopping = false

    @ThingService.updateDevice uuid: @scope.flow.flowId, deploying: true, stopping: false
      .then =>
        @FlowService.setActiveFlow(@scope.flow)
        @FlowService.saveActiveFlow()
      .then =>
        @FlowService.immediateNotifyFlowSaved()
        @FlowService.start @scope.flow
      .catch (error) =>
        @NotifyService.alert title: 'Flow Start Failed', content: error.message

  immediateStop: (e) =>
    e?.preventDefault()
    @scope.device.deploying = false
    @scope.device.stopping = true
    @ThingService.updateDevice uuid: @scope.flow.flowId, deploying: false, stopping: true
      .then =>
        @FlowService.stop @scope.flow
      .catch (error) =>
        @NotifyService.alert title: 'Flow Stop Failed', content: error.message

angular.module('octobluApp').controller 'FlowDeployButtonController', FlowDeployButtonController
