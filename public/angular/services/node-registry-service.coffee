class NodeRegistryService
  constructor: ($http, ThingService) ->
    @http = $http
    @ThingService = ThingService

  needsPermissions: (flowId, nodeTypes) =>
    @http.get 'https://raw.githubusercontent.com/octoblu/nanocyte-node-registry/master/registry.json'
      .then (response) =>
        response.data
      .then (nodeRegistry) =>
        @ThingService.getThing(uuid: flowId)
          .then (thing) =>
            nodeTypes = _.uniq nodeTypes
            registryUuids = _.uniq _.compact _.flatten _.map nodeTypes, (nodeType) =>
              type = nodeType.replace /operation:/, ''
              type = type.replace /:.*/, ''
              nodeRegistry[type]?.sendWhitelist

            _.difference registryUuids, thing.sendWhitelist

angular.module('octobluApp').service 'NodeRegistryService', NodeRegistryService
