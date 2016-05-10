class OmniService
  constructor: (FlowNodeTypeService, NodeTypeService, FlowService, $q) ->
    @FlowNodeTypeService = FlowNodeTypeService
    @NodeTypeService = NodeTypeService
    @FlowService = FlowService
    @q = $q

  fetch: (omniItems) =>
    @q.all([
      @getOmniItems omniItems
      @getFlowNodeTypes()
      @getUnconfiguredNodeTypes()
    ]).then (results) =>
      _.union _.flatten(results, true)

  getOmniItems: (items) =>
    @q (resolve) =>
      resolve _.map items, (item) =>
        _.extend item, omniboxItemTemplateUrl: '/pages/omnibox-flow-node.html'

  getFlowNodeTypes: =>
    @FlowNodeTypeService.getFlowNodeTypes().then (flowNodeTypes) =>
      _.map flowNodeTypes, (flowNodeType) =>
        _.extend flowNodeType, omniboxItemTemplateUrl: '/pages/omnibox-flow-node-type.html'

  getUnconfiguredNodeTypes: =>
    @NodeTypeService.getUnconfiguredNodeTypes().then (nodeTypes) =>
      _.map nodeTypes, (nodeType) =>
        _.extend nodeType, omniboxItemTemplateUrl: '/pages/omnibox-node-type.html'

  selectItem: (item) =>
    if item.id?
      return @FlowService.selectNode item

    @FlowService.addNodeFromFlowNodeType item

angular.module('octobluApp').service 'OmniService', OmniService
