class FlowTutorialController
  constructor: ($scope, $stateParams, $injector, FlowTutorial) ->
    return unless $stateParams.tutorial

    @scope = $scope
    @FlowTutorial = FlowTutorial

    @tutorial = $injector.get $stateParams.tutorial
    @scope.$watch 'activeFlow', @onFlowChanged, true

  onFlowChanged: (flow) =>
    return unless flow?

    flow.tutorial = @tutorial

    flowTutorial = new @FlowTutorial flow

    @scope.steps = flowTutorial.getNextChapter()
    console.log @scope.steps

angular.module('octobluApp').controller 'FlowTutorialController', FlowTutorialController
