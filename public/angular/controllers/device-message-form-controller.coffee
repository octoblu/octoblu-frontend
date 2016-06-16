{angular, _} = window

class DeviceMessageFormController
  constructor: ($q, $scope, NotifyService, RefParser, ThingService) ->
    @q = $q
    @scope = $scope
    @NotifyService = NotifyService
    @RefParser = RefParser
    @ThingService = ThingService

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
      @RefParser.dereference device.schemas, (error, schemas) =>
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
