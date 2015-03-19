class FlowTutorialController
  constructor : ($scope, FlowTutorialService)->
    @scope = $scope
    @FlowTutorialService = FlowTutorialService

    @scope.$watch 'activeFlow', @updateStep, true

    @scope.$on 'flow-node-type-selected', (event, flowNodeType) =>
      @scope.activeFlow.nodes.push _.cloneDeep flowNodeType

    @scope.activeFlow =
      zoomScale: 1
      zoomX: 0
      zoomY: 0
      nodes: []
      links: []

  updateStep: (newFlow)=>
    @FlowTutorialService.getStep(newFlow)
      .then (step) =>
        console.log step
        @scope.flowNodeTypes = step.flowNodeTypes
    


angular.module('octobluApp').controller 'FlowTutorialController', FlowTutorialController
