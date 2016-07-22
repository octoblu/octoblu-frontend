class DeviceCollectionController
  constructor: ($scope, $state, RegistryService, DeviceLogo) ->
    @scope = $scope
    @scope.collapsed = @scope.collapsedByDefault
    @DeviceLogo = DeviceLogo
    @RegistryService = RegistryService
    @state = $state

  logoUrl: (device) =>
    new @DeviceLogo(device).get()

  nextStepUrl: (device) =>
    unless device?.defaults?.nodeType?.deprecated
      registryUrl = @RegistryService.getDeviceUrl device
      return registryUrl if registryUrl?

    return device.createUri if device.useCreateUri
    return device.configureUri if device.useConfigureUri

    return @state.href 'material.nodewizard-add', { nodeTypeId: device._id } unless device.uuid

    params = {}

    if device.category == 'channel'
      sref = 'material.channel'
      params.id = device.defaults.nodeType.channelid
    else if device.category == 'microblu'
      sref = 'material.microblu'
      params.uuid = device.uuid
    else
      sref = 'material.device'
      params.uuid = device.uuid

    @state.href sref, params

angular.module('octobluApp').controller 'DeviceCollectionController', DeviceCollectionController
