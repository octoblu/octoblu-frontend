class NodeConversionService
  constructor: (NodeTypeService, DeviceLogo) ->
    @NodeTypeService = NodeTypeService
    @DeviceLogo = DeviceLogo

  convert: (node) =>
    node.defaults ?= {}
    node.defaults.nodeType = @NodeTypeService.getNodeTypeByType node.type

    defaults =
      class:            _.kebabCase node.type
      logo:             new @DeviceLogo(node).get(),
      defaults:         _.omit(node, 'defaults'),
      input:            1,
      output:           1,
      formTemplatePath: "/pages/node_forms/" + node.category + "_form.html",

    _.extend node, defaults

angular.module('octobluApp').service 'NodeConversionService', NodeConversionService
