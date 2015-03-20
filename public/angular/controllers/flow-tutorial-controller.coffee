class FlowTutorialController
  constructor: ($scope, $stateParams, $injector, FlowTutorial) ->
    return unless $stateParams.tutorial

    @scope = $scope
    @FlowTutorial = FlowTutorial

    @tutorial = $injector.get $stateParams.tutorial
    @scope.$watch 'activeFlow', @onFlowChanged, true

  onFlowChanged: (flow) =>
    return unless flow?
    return @setupTutorial() unless @flowTutorial?

    @flowTutorial.updateStep()

  setupTutorial: () =>
    @scope.activeFlow.tutorial = { steps: @tutorial, visited: {} } unless @scope.activeFlow.tutorial?

    @flowTutorial = new @FlowTutorial @scope.activeFlow
    @flowTutorial.start()



angular.module('octobluApp').controller 'FlowTutorialController', FlowTutorialController
