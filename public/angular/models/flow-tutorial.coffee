angular.module('octobluApp').factory 'FlowTutorial', ($window)->
  class FlowTutorial
    constructor: (@flow) ->

    getNextChapter: =>
      stepName = @getStepName()
      console.log 'stepName', stepName
      @flow.tutorial[stepName]

    getStepName: () =>
      weatherNode = _.find @flow.nodes, { type: 'channel:weather' }
      weatherNodeSelected = @flow.selectedFlowNode?.type == 'channel:weather'
      triggerNode = _.find @flow.nodes, { type: 'operation:trigger' }
      weatherTriggerLink = _.find @flow.links, { from: triggerNode?.id, to: weatherNode?.id }
      emailNode = _.find @flow.nodes, { type: 'channel:email' }
      emailLink = _.find @flow.links, { from: weatherNode?.id, to: emailNode?.id }

      return 'add_weather_node' unless weatherNode
      return 'select_weather_node' if !weatherNode.queryParams?.city && !weatherNodeSelected
      return 'configure_weather_node' unless weatherNode.queryParams?.city
      return 'add_email_node' unless emailNode
      # return 'step6' unless emailNode.bodyParams?.to? && emailNode.bodyParams.body == '{{msg.temperature}}'
      # return 'step7' unless emailLink
      # return 'step8' unless @flow.deployed
      # return 'step9' unless @flow.triggered
      # return 'step10'

      return 'end_tutorial'

    updateStep: () =>
