class AddEndoController
  constructor: ($scope, $stateParams, NodeTypeService) ->
    NodeTypeService.getNodeTypeById($stateParams.nodeTypeId)
      .then (nodeType) =>
        $scope.nodeType  = nodeType;
        $scope.fragments = [{linkTo: 'material.things.all', label: 'All Things'}, {label: "Add " + nodeType.name}]

angular.module('octobluApp').controller 'AddEndoController', AddEndoController
