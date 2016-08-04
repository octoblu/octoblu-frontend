{OctobluDeviceSchemaTransmogrifier} = window

class FlowDeviceController
  constructor: ($scope, MeshbluJsonSchemaResolverService, NotifyService, ThingService, meshbluConfig, AuthService) ->
    @scope                            = $scope
    @NotifyService                    = NotifyService
    @ThingService                     = ThingService
    @meshbluJsonSchemaResolverService = new MeshbluJsonSchemaResolverService {meshbluConfig}
    @Transmogrifier                   = OctobluDeviceSchemaTransmogrifier

    @scope.$watch 'flowNode.uuid', @refreshDevice
    AuthService.getCurrentUser().then ({userDevice}) =>
      @scope.beta = userDevice.octoblu?.beta ? {}

  getDevice: (uuid) =>
    @ThingService.getThing({uuid}).then @resolveSchemas

  refreshDevice: (uuid) =>
    return unless uuid?
    @scope.flowNode.staticMessage = {} unless @scope.flowNode.staticMessage?
    @scope.device  = null
    @scope.loading = true

    @getDevice(uuid).then(@setDevice).catch(@NotifyService.notifyError)

  resolveSchemas: (device) =>
    @meshbluJsonSchemaResolverService.resolve device

  setDevice: (device) =>
    @scope.device = device
    @scope.device.options ?= {}
    @scope.loading = false

angular.module('octobluApp').controller 'FlowDeviceController', FlowDeviceController
