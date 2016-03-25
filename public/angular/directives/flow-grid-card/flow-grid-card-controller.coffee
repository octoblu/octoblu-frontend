class FlowGridCardController
  constructor: ($scope, FlowService) ->
    @scope = $scope
    @FlowService = FlowService

angular.module('octobluApp').controller 'FlowGridCardController', FlowGridCardController
