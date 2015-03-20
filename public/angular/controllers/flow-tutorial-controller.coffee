class FlowTutorialController
  constructor: ($scope, FlowTutorial, tutorial) ->
    @flowTutorial = new FlowTutorial tutorial
    @flowTutorial.start()

    $scope.$watch 'activeFlow', @flowTutorial.updateStep, true

angular.module('octobluApp').controller 'FlowTutorialController', FlowTutorialController
