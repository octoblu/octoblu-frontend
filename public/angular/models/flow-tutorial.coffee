angular.module('octobluApp').factory 'FlowTutorial', ($window)->
  class FlowTutorial
    constructor: (@flow) ->
      {@steps, @visited} = @flow.tutorial

      @tour = new $window.Shepherd.Tour defaults: classes: 'shepherd-theme-default'

      _.each @steps, (step) =>
        @tour.addStep step.id, _.cloneDeep step

      @tour.on 'show', (steps) =>
        return unless steps.previous? && steps.previous.id != steps.step.id
        @currentStep = steps.step.id
        @visited[steps.previous.id] = true

      @tour.on 'complete', =>
        @visited[@currentStep] = true

    start: =>
      @tour.start()

    getStepName: () =>
      weatherNode = _.find @flow.nodes, { type: 'channel:weather' }
      triggerNode = _.find @flow.nodes, { type: 'operation:trigger' }
      weatherTriggerLink = _.find @flow.links, { from: triggerNode?.id, to: weatherNode?.id }
      emailNode = _.find @flow.nodes, { type: 'channel:email' }
      emailLink = _.find @flow.links, { from: weatherNode?.id, to: emailNode?.id }

      return 'intro' unless @visited.intro
      return 'open_configured_nodes' unless @visited.open_configured_nodes
      return 'add_weather_node' unless weatherNode
      return 'configure_weather_node' unless weatherNode.queryParams?.city
      return 'add_email_node' unless emailNode
      # return 'step6' unless emailNode.bodyParams?.to? && emailNode.bodyParams.body == '{{msg.temperature}}'
      # return 'step7' unless emailLink
      # return 'step8' unless @flow.deployed
      # return 'step9' unless @flow.triggered
      # return 'step10'

      return 'end_tutorial' unless @visited.end_tutorial
      return

    updateStep: () =>
      stepName = @getStepName @flow
      return @tour.show stepName if stepName?
      @tour.hide()
