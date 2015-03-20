angular.module('octobluApp').factory 'FlowTutorial', ($q)->
  class FlowTutorial
    constructor: (@tutorial) ->

    getStepName: (flow) =>
      weatherNode = _.find flow.nodes, { type: 'channel:weather' }
      triggerNode = _.find flow.nodes, { type: 'operation:trigger' }
      weatherTriggerLink = _.find flow.links, { from: triggerNode?.id, to: weatherNode?.id }
      emailNode = _.find flow.nodes, { type: 'channel:email' }
      emailLink = _.find flow.links, { from: weatherNode?.id, to: emailNode?.id }
      browserMaximized = flow.browserMaximized

      return 'step1' unless weatherNode?
      return 'step2' unless weatherNode.queryParams?.city?
      return 'step3' unless triggerNode
      return 'step4' unless weatherTriggerLink
      return 'step5' unless emailNode
      return 'step6' unless emailNode.bodyParams?.to? && emailNode.bodyParams.body == '{{msg.temperature}}'
      return 'step7' unless emailLink
      return 'step8' unless flow.deployed
      return 'step9' unless flow.triggered
      return 'step10'

    getStep: (flow) =>
      stepName = @getStepName flow
      console.log 'stepName', stepName
      $q.when @tutorial[stepName]
