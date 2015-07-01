class ConfigureController
  constructor: ($scope, $state, $stateParams, NodeService, OCTOBLU_ICON_URL) ->
    @scope = $scope
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL

    activeTab = $stateParams.tab || 'all'

    NodeService.getNodes().then (devices) =>
      devices = _.map devices, @addLogoUrl
      @scope.loading = false
      @scope.devices = devices

  addLogoUrl: (device) =>
    return device if device.logo
    return device.logo = "#{@OCTOBLU_ICON_URL}node/other.svg" unless device && device.type

    type = device.type.replace 'octoblu:', 'device:'
    device.logo = @OCTOBLU_ICON_URL + type.replace(':', '/') + '.svg'

    device

  nextStepUrl: (device) =>
    sref = "material.#{device.category}"
    params = {}

    if device.category == 'device' || device.category == 'microblu'
      params.uuid = device.uuid
    else if device.category == 'channel'
      params.id = device.channelid

    $state.href sref, params


angular.module('octobluApp').controller 'ConfigureController', ConfigureController
