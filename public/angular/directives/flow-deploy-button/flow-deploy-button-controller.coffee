class FlowDeployButtonController
  constructor: ($scope, FlowService, ThingService, NotifyService, MESHBLU_HOST, MESHBLU_PORT, $cookies) ->
    @scope = $scope
    @FlowService = FlowService
    @ThingService = ThingService
    @cookies = $cookies
    @MESHBLU_HOST = MESHBLU_HOST
    @MESHBLU_PORT = MESHBLU_PORT
    @NotifyService = NotifyService

    @start = _.throttle @immediateStart, 1000, leading: true, trailing: false
    @stop = _.throttle @immediateStop, 1000, leading: true, trailing: false

  immediateStart : (e) =>
    e?.preventDefault()
    return @deployFlow() unless @scope.flow.pendingPermissions
    options =
      title: 'Permissions Update'
      content: 'In order to communicate with your devices, some permissions need to be updated. Press Approve All in the Permissions Inspector.'
      ok: 'Update and Deploy'
      cancel: 'Deploy Without Update'
    @NotifyService.confirm options
      .then =>
        @scope.flow.updatePendingPermissions
      .catch => return
      .finally @deployFlow

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
