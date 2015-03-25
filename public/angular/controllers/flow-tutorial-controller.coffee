class FlowTutorialController
  constructor: ($scope, $stateParams, $injector, FlowTutorial) ->
    return unless $stateParams.tutorial

    @scope = $scope
    @FlowTutorial = FlowTutorial

    @tutorial = $injector.get $stateParams.tutorial

    @scope.$watch 'activeFlow', @onFlowChanged, true

  onFlowChanged: (flow, oldFlow) =>
    return unless flow?

    flow.tutorial = @tutorial unless oldFlow? 

    unless flow.tutorial?
      delete @scope.steps
      return

    flowTutorial = new @FlowTutorial flow

    @scope.steps = flowTutorial.getNextChapter()

angular.module('octobluApp').controller 'FlowTutorialController', FlowTutorialController
