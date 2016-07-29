{angular, _} = window

class DeviceConfigureFormController
  constructor: ($q, $scope, NotifyService, MeshbluJsonSchemaResolverService, meshbluConfig, ThingService) ->
    @q = $q
    @scope = $scope
    @NotifyService = NotifyService
    @meshbluJsonSchemaResolverService = new MeshbluJsonSchemaResolverService {meshbluConfig}
    @ThingService = ThingService
    @Transmogrifier = OctobluDeviceSchemaTransmogrifier

    @scope.$watch 'uuid', @refreshDevice

  getDevice: =>
    @ThingService.getThing(uuid: @scope.uuid).then @resolveSchemas

  refreshDevice: =>
    @scope.device  = null
    @scope.loading = true

    @getDevice().then(@setDevice).catch(@NotifyService.notifyError)

  resolveSchemas: (device) =>
    @meshbluJsonSchemaResolverService.resolve device

  setDevice: (device) =>
    @scope.device = device
    @scope.device.options ?= {}
    @scope.loading = false

angular.module('octobluApp').controller 'DeviceConfigureFormController', DeviceConfigureFormController
