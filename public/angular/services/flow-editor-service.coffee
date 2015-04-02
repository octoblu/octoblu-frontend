class FlowEditorService
  deleteSelection: (activeFlow) ->
    return unless activeFlow?
    if activeFlow.selectedFlowNode?
      nodeId = activeFlow.selectedFlowNode.id
      fromLinks = _.filter(activeFlow.links, from: nodeId)
      toLinks = _.filter(activeFlow.links, to: nodeId)
      activeFlow.links = _.difference activeFlow.links, _.union fromLinks, toLinks
      _.remove activeFlow.nodes, id: nodeId
      activeFlow.selectedFlowNode = null

    if activeFlow.selectedLink?
      linksToDelete =
        to: activeFlow.selectedLink.to
        from: activeFlow.selectedLink.from
      _.remove activeFlow.links, linksToDelete
      activeFlow.selectedLink = null

angular.module('octobluApp').service 'FlowEditorService', FlowEditorService
