class NodeRegistryService
  constructor: ($http, ThingService, REGISTRY_URL) ->
    @http = $http
    @ThingService = ThingService
    @REGISTRY_URL = REGISTRY_URL

  needsPermissions: (flowId, nodeTypes) =>
    @http.get @REGISTRY_URL
      .then (response) =>
        response.data
      .then (nodeRegistry) =>
        @ThingService.getThing(uuid: flowId)
          .then (thing) =>
            nodeTypes = _.uniq nodeTypes
            registryUuids = _.uniq _.compact _.flatten _.map nodeTypes, (nodeType) =>
              nodeType ?= ''
              type = nodeType.replace /operation:/, ''
              type = type.replace /:.*/, ''
              nodeRegistry[type]?.sendWhitelist

            _.difference registryUuids, thing.sendWhitelist

angular.module('octobluApp').service 'NodeRegistryService', NodeRegistryService
