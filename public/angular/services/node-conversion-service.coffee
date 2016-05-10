class NodeConversionService
  constructor: (NodeTypeService, DeviceLogo) ->
    @NodeTypeService = NodeTypeService
    @DeviceLogo = DeviceLogo

  convert: (node) =>
    @NodeTypeService.getNodeTypeByType node.type
      .then (nodeType) =>
        node.defaults ?= _.omit node, 'defaults'
        node.defaults.nodeType = nodeType

        defaults =
          class:            _.kebabCase node.type
          logo:             new @DeviceLogo(node).get()
          input:            1
          output:           1
          helpText:         node.defaults?.nodeType?.helpText
          formTemplatePath: "/pages/node_forms/" + node.category + "_form.html"

        _.extend node, defaults

angular.module('octobluApp').service 'NodeConversionService', NodeConversionService
