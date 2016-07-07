{angular, _} = window

class DeviceMessageFormController
  constructor: ($q, $scope, NotifyService, MeshbluJsonSchemaResolver, meshbluConfig, ThingService) ->
    @q = $q
    @scope = $scope
    @NotifyService = NotifyService
    @meshbluJsonSchemaResolver = new MeshbluJsonSchemaResolver {meshbluConfig}
    @ThingService = ThingService
    @Transmogrifier = OctobluDeviceSchemaTransmogrifier

    @scope.$watch 'uuid', @refreshDevice
    @scope.$watch 'model', @injectRespondTo, true

  getDevice: =>
    @ThingService.getThing(uuid: @scope.uuid).then @resolveSchemas

  injectRespondTo: =>
    return unless @shouldResponseTo()
    _.set @scope.model, 'metadata.respondTo', {
      flowId: @scope.flowId
      nodeId: @scope.nodeId
    }

  refreshDevice: =>
    @scope.device  = null
    @scope.loading = true

    @getDevice().then(@setDevice).catch(@NotifyService.notifyError)

  resolveSchemas: (device) =>
    @q (resolve, reject) =>
      schemas = device.schemas ? {}
      @meshbluJsonSchemaResolver.resolve schemas, (error, schemas) =>
        return reject error if error?
        return resolve _.extend({schemas}, device)

  setDevice: (device) =>
    @scope.device = device
    @scope.device.options ?= {}
    @scope.loading = false

  shouldResponseTo: =>
    schemas   = _.get @scope, 'device.schemas.message'
    schema    = _.get schemas, @scope.selectedSchemaKey
    respondTo = _.get schema, 'properties.metadata.properties.respondTo'
    respondTo?

angular.module('octobluApp').controller 'DeviceMessageFormController', DeviceMessageFormController
