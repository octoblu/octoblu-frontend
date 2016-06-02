class AddEndoController
  constructor: ($scope, $stateParams, $window, NodeTypeService) ->
    $scope.loadingNodeType = true;
    NodeTypeService.getNodeTypeById($stateParams.nodeTypeId)
      .then (nodeType) =>
        $scope.nodeType  = nodeType;
        $scope.fragments = [{linkTo: 'material.things.all', label: 'All Things'}, {label: "Add " + nodeType.name}]
        
        $window.location = nodeType.url;

angular.module('octobluApp').controller 'AddEndoController', AddEndoController
