class OmniService
  constructor: (FlowNodeTypeService, RegistryService, NodeTypeService, FlowService, $q) ->
    @FlowNodeTypeService = FlowNodeTypeService
    @RegistryService = RegistryService
    @NodeTypeService = NodeTypeService
    @FlowService = FlowService
    @q = $q

  fetch: (omniItems) =>
    @q.all([
      @getOmniItems omniItems
      @getRegistries()
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
        _.extend {input: 1, output: 1}, nodeType, omniboxItemTemplateUrl: '/pages/omnibox-node-type.html'

  getRegistries: =>
    return @RegistryService.getRegistries().then (registries) =>
      nodes = []
      _.each _.values(registries), (registrySet) =>
        _.each _.values(registrySet), (registry) =>
          _.each registry.items, (item) =>
            item.input = 1
            item.output = 1
            item.omniboxItemTemplateUrl = '/pages/omnibox-node-type.html'
            nodes.push item
      return nodes

  selectItem: (item) =>
    if item.id?
      return @FlowService.selectNode item

    @FlowService.addNodeFromFlowNodeType item

angular.module('octobluApp').service 'OmniService', OmniService
