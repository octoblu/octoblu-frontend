class DeviceCollectionController
  constructor: ($scope, $state, DeviceLogo) ->
    @scope = $scope
    @DeviceLogo = DeviceLogo
    @scope.showCategory = true
    @state = $state

  logoUrl: (device) =>
    new @DeviceLogo(device).get()

  nextStepUrl: (device) =>
    sref = "material.#{device.category}"
    params = {}

    return @state.href('material.nodewizard-add', nodeTypeId: device._id) unless device.uuid

    if device.category == 'gateblu'
      sref = 'material.device'
      params.uuid = device.uuid
    if device.category == 'device' || device.category == 'microblu'
      params.uuid = device.uuid
    if device.category == 'channel'
      params.id = device.defaults.nodeType.channelid

    @state.href(sref, params)

angular.module('octobluApp').controller 'DeviceCollectionController', DeviceCollectionController
