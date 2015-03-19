class FlowTutorialController
  constructor : ($scope, FlowTutorialService)->
    $scope.activeFlow = {
      zoomScale: 1,
      zoomX: 0,
      zoomY: 0
    }
    FlowTutorialService.getStep($scope.activeFlow)
      .then (step) =>
        $scope.flowNodeTypes = step.flowNodeTypes


angular.module('octobluApp').controller 'FlowTutorialController', FlowTutorialController
