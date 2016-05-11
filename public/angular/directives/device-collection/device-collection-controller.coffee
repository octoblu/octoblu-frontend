class DeviceCollectionController
  constructor: ($scope, $state, DeviceLogo) ->
    @scope = $scope
    @DeviceLogo = DeviceLogo
    @scope.showCategory = true
    @state = $state

  logoUrl: (device) =>
    new @DeviceLogo(device).get()

  nextStepUrl: (device) =>
    params = {}

    return @state.href('material.nodewizard-add', nodeTypeId: device._id) unless device.uuid
    if device.category == 'channel'
      sref = 'material.channel'
      params.id = device.defaults.nodeType.channelid
    else if device.category == 'microblu'
      sref = 'material.microblu'
      params.uuid = device.uuid
    else
      sref = 'material.device'
      params.uuid = device.uuid

    @state.href(sref, params)

angular.module('octobluApp').controller 'DeviceCollectionController', DeviceCollectionController
