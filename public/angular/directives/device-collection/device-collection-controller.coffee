class DeviceCollectionController
  constructor: ($scope, $state, OCTOBLU_ICON_URL) ->
    @scope = $scope
    @scope.showCategory = true
    @state = $state
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL

  logoUrl: (device) =>
    return device.logo if device.logo
    return device.logo = "#{@OCTOBLU_ICON_URL}node/other.svg" unless device && device.type

    type = device.type.replace 'octoblu:', 'device:'
    device.logo = @OCTOBLU_ICON_URL + type.replace(':', '/') + '.svg'
    device.logo

  nextStepUrl: (device) =>
    sref = "material.#{device.category}"
    params = {}

    return @state.href('material.nodewizard.add', nodeTypeId: device._id) unless device.uuid
    if device.category == 'device' || device.category == 'microblu'
      params.uuid = device.uuid
    if device.category == 'channel'
      params.id = device.channelid

    @state.href(sref, params)

angular.module('octobluApp').controller 'DeviceCollectionController', DeviceCollectionController
