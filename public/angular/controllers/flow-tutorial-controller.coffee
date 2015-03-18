class FlowTutorialController
  constructor : ($scope)->
    $scope.activeFlow = {
      zoomScale: 1,
      zoomX: 0,
      zoomY: 0
    }

angular.module('octobluApp').controller 'FlowTutorialController', FlowTutorialController
