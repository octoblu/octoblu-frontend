class NodeConversionService
  constructor: (RegistryService, NodeTypeService, DeviceLogo) ->
    @RegistryService = RegistryService
    @NodeTypeService = NodeTypeService
    @DeviceLogo = DeviceLogo

  getRegistryItem: (node, nodeType) =>
    @RegistryService.getRegistries()
      .then =>
        item = @RegistryService.getItemFromDevice node
        return nodeType unless item?
        return item

  getNodeType: (node) =>
    return @NodeTypeService
      .getNodeTypeByType node.type
      .then (nodeType) =>
        return @getRegistryItem(node) unless nodeType?
        return @getRegistryItem(node, nodeType) if nodeType.deprecated
        return nodeType

  convert: (node) =>
    @getNodeType(node)
      .then (nodeType) =>
        node.defaults ?= _.omit node, 'defaults'
        node.defaults.nodeType = nodeType

        if node.category == 'channel'
          formTemplatePath = '/pages/node_forms/channel_form.html'
        else
          formTemplatePath = '/pages/node_forms/device_form.html'

        defaults =
          class:            _.kebabCase node.type
          logo:             new @DeviceLogo(node).get()
          input:            1
          output:           1
          helpText:         nodeType?.helpText ? nodeType?.description
          formTemplatePath: formTemplatePath

        _.extend defaults, node

angular.module('octobluApp').service 'NodeConversionService', NodeConversionService
