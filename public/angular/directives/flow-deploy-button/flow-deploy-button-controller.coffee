class FlowDeployButtonController
  constructor: ($scope, FlowService, MESHBLU_HOST, MESHBLU_PORT, $cookies) ->
    @scope = $scope
    @FlowService = FlowService
    @cookies = $cookies
    @MESHBLU_HOST = MESHBLU_HOST
    @MESHBLU_PORT = MESHBLU_PORT

    @start = _.throttle @immediateStart, 5000
    @stop = _.throttle @immediateStop, 5000

  immediateStart : (e) =>
    e?.preventDefault()
    lastDeployedHash = _.clone @scope.flow.hash
    _.each @scope.flow.nodes, (node) =>
      delete node.errorMessage

    @FlowService.saveActiveFlow()
      .then =>
        @FlowService.immediateNotifyFlowSaved()
        @FlowService.start @scope.flow

  immediateStop: (e) =>
    e?.preventDefault()
    @FlowService.stop @scope.flow

angular.module('octobluApp').controller 'FlowDeployButtonController', FlowDeployButtonController
