angular.module('octobluApp').factory 'FlowTutorial', ($window)->
  class FlowTutorial
    constructor: (@tutorial) ->
      @stepsVisited = {}
      @tour = new $window.Shepherd.Tour defaults: classes: 'shepherd-theme-default'

      _.each @tutorial, (step) =>
        @tour.addStep step.id, step

      @tour.on 'show', (steps) =>
        return unless steps.previous? && steps.previous.id != steps.step.id
        @stepsVisited[steps.previous.id] = true

    start: =>
      @tour.start()

    getStepName: (flow) =>
      weatherNode = _.find flow.nodes, { type: 'channel:weather' }
      triggerNode = _.find flow.nodes, { type: 'operation:trigger' }
      weatherTriggerLink = _.find flow.links, { from: triggerNode?.id, to: weatherNode?.id }
      emailNode = _.find flow.nodes, { type: 'channel:email' }
      emailLink = _.find flow.links, { from: weatherNode?.id, to: emailNode?.id }

      return 'intro' unless @stepsVisited.intro
      return 'open_configured_nodes' unless @stepsVisited.open_configured_nodes
      return 'add_weather_node' unless weatherNode
      return 'end_tutorial' unless @stepsVisited.end_tutorial
      return


      # return 'step5' unless emailNode
      # return 'step6' unless emailNode.bodyParams?.to? && emailNode.bodyParams.body == '{{msg.temperature}}'
      # return 'step7' unless emailLink
      # return 'step8' unless flow.deployed
      # return 'step9' unless flow.triggered
      # return 'step10'

    getStep: (flow) =>
      stepName = @getStepName flow
      console.log 'stepName', stepName
      @tutorial[stepName]

    updateStep: (flow) =>
      return unless flow?
      stepName = @getStepName flow
      console.log
      return @tour.show stepName if stepName?
      @tour.hide()
