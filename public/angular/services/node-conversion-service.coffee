class NodeConversionService
  constructor: (NodeTypeService, DeviceLogo) ->
    @NodeTypeService = NodeTypeService
    @DeviceLogo = DeviceLogo

  convert: (node) =>
    @NodeTypeService.getNodeTypeByType node.type
      .then (nodeType) =>
        node.defaults ?= _.omit node, 'defaults'
        node.defaults.nodeType = nodeType

        if node.category == 'channel'
          formTemplatePath = '/pages/node_forms/channel_form.html'
        else if node.category == 'microblu'
          formTemplatePath = '/pages/node_forms/microblu_form.html'
        else
          formTemplatePath = '/pages/node_forms/device_form.html'

        defaults =
          class:            _.kebabCase node.type
          logo:             new @DeviceLogo(node).get()
          input:            1
          output:           1
          helpText:         node.defaults?.nodeType?.helpText
          formTemplatePath: formTemplatePath

        _.extend defaults, node

angular.module('octobluApp').service 'NodeConversionService', NodeConversionService
