angular.module('octobluApp').factory 'FlowTutorial', ($window)->
  class FlowTutorial
    constructor: (@flow) ->

    getNextChapter: =>
      stepName = @getStepName()
      steps = @flow.tutorial[stepName]
      steps = @addEndFlowButton steps
      steps

    addEndFlowButton: (steps) =>
      _.map steps, (step) =>
        step = _.cloneDeep step
        step.showCancelLink = true

        addNext = step.buttons != false

        step.buttons = []
        step.buttons.push
          text: 'End Tutorial'
          classes: 'end-tutorial-button'
          action: =>
            Shepherd.currentTour?.cancel()
            @flow.tutorial = null

        if addNext
          step.buttons.push
            text: 'Next'
            classes: 'flow-tutorial-button'
            action: ->
              Shepherd.currentTour.next()
        step


    getStepName: =>
      weatherTriggerLink = _.find @flow.links, { from: triggerNode?.id, to: weatherNode?.id }

      return 'open_node_browser_for_weather' unless @configuredNodeBrowserOpened() || @weatherNodeAdded()
      return 'add_weather_node' unless @weatherNodeAdded()
      return 'select_weather_node' unless @weatherNodeSelected() || @weatherNodeConfigured()
      return 'configure_weather_node' unless @weatherNodeConfigured() && !@weatherNodeSelected()
      return 'open_node_browser_for_email' unless @configuredNodeBrowserOpened() || @emailNodeAdded()
      return 'add_email_node' unless @emailNodeAdded()
      return 'select_email_node' unless @emailNodeSelected() || @emailNodeConfigured()
      return 'configure_email_node_to' unless @emailNodeConfiguredTo()
      return 'configure_email_node_body' unless @emailNodeConfiguredBody()
      return 'link_weather_to_email' unless @weatherLinkedToEmail()
      return 'open_operation_browser_for_trigger' unless @operationNodeBrowserOpened() || @triggerNodeAdded()
      return 'add_trigger_node' unless @triggerNodeAdded()
      return 'link_trigger_to_weather' unless @triggerLinkedToWeather()
      return 'deploy_flow' unless @flowDeployed()
      return 'end_tutorial'

    configuredNodeBrowserOpened: =>
      @flow.browserMaximized && @flow.browserTab?.name == 'nodes'

    operationNodeBrowserOpened: =>
      @flow.browserMaximized && @flow.browserTab?.name == 'operators'

    weatherNodeAdded: =>
      _.any @flow.nodes, { type: 'channel:weather' }

    weatherNodeSelected: =>
      @flow.selectedFlowNode?.type == 'channel:weather'

    weatherNodeConfigured: =>
      weatherNode = _.find @flow.nodes, { type: 'channel:weather' }
      weatherNode.queryParams?.city?

    emailNodeAdded: =>
      _.any @flow.nodes, { type: 'channel:email' }

    triggerNodeAdded: =>
      _.any @flow.nodes, { type: 'operation:trigger' }

    emailNodeConfigured: =>
      emailNode = _.find @flow.nodes, { type: 'channel:email' }
      emailNode.bodyParams?.to? && emailNode.bodyParams?.body == '{{msg.temperature}}'

    emailNodeConfiguredBody: =>
      emailNode = _.find @flow.nodes, { type: 'channel:email' }
      emailNode.bodyParams?.body == '{{msg.temperature}}'

    emailNodeConfiguredTo: =>
      emailNode = _.find @flow.nodes, { type: 'channel:email' }
      emailNode.bodyParams?.to?

    emailNodeSelected: =>
      @flow.selectedFlowNode?.type == 'channel:email'

    weatherLinkedToEmail: =>
      weatherNode = _.find @flow.nodes, { type: 'channel:weather' }
      emailNode = _.find @flow.nodes, { type: 'channel:email' }
      _.any @flow.links, { from: weatherNode?.id, to: emailNode?.id }

    triggerLinkedToWeather: =>
      triggerNode = _.find @flow.nodes, { type: 'operation:trigger' }
      weatherNode = _.find @flow.nodes, { type: 'channel:weather' }
      _.any @flow.links, { from: triggerNode?.id, to: weatherNode?.id }

    flowDeployed: =>
      @flow.deployed

    updateStep: () =>
