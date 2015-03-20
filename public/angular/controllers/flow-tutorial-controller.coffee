class FlowTutorialController

  constructor: ($scope, $window, FlowTutorial, tutorial) ->
    console.log 'sup dawg'
    @flowTutorial = new FlowTutorial tutorial
    @scope = $scope
    @window = $window
    @FlowTutorial = FlowTutorial

    @scope.$watch 'activeFlow', @updateStep, true
    @scope.$watch 'tutorial', @startTutorial

  startTutorial: (tutorial) =>
    return unless tutorial?
    @flowTutorial = new @FlowTutorial tutorial

  updateStep: (newFlow)=>
    return unless newFlow?
    @flowTutorial.getStep(newFlow).then (step) =>
      @startShepherd step?.helpers

  startShepherd: (helpers) =>
    @shepherd?.cancel()
    return if _.isEmpty helpers

    @shepherd = new @window.Shepherd.Tour defaults: classes: 'shepherd-theme-default'

    _.each helpers, (helper) =>
      @shepherd.addStep 'tutorial', helper

    @shepherd.start()



angular.module('octobluApp').controller 'FlowTutorialController', FlowTutorialController
