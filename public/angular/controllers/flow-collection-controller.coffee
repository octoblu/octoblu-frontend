class FlowCollectionController
  constructor: ($scope, FlowNodeTypeService, NodeService) ->
    @scope = $scope
    @FlowNodeTypeService = FlowNodeTypeService

angular.module('octobluApp').controller 'FlowCollectionController', FlowCollectionController
