class DeviceLogo
  constructor: (@device, {@OCTOBLU_ICON_URL}) ->

  get: =>
    logo = @_getLogoFromDevice @device
    logo = logo.replace('http://', 'https://')
    return logo

  _getLogoFromDevice: (device) =>
    return device.logo if device.logo
    return device.logo = "#{@OCTOBLU_ICON_URL}node/other.svg" unless device && device.type

    type = device.type.replace 'octoblu:', 'device:'
    return @OCTOBLU_ICON_URL + type.replace(':', '/') + '.svg'

angular.module('octobluApp').service 'DeviceLogo', (OCTOBLU_ICON_URL) ->
  (options) ->
    new DeviceLogo options, {OCTOBLU_ICON_URL}
