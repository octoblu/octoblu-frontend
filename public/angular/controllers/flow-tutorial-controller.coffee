class FlowTutorialController
  constructor: ($scope, $stateParams, $injector, FlowTutorial) ->
    @scope = $scope
    @FlowTutorial = FlowTutorial

    @scope.$watch 'activeFlow', @onFlowChanged, true

  onFlowChanged: (flow) =>
    return unless flow?

    unless flow.tutorial?
      delete @scope.steps
      return

    flowTutorial = new @FlowTutorial flow

    @scope.steps = flowTutorial.getNextChapter()

angular.module('octobluApp').controller 'FlowTutorialController', FlowTutorialController
