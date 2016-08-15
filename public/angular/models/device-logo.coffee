class DeviceLogo
  constructor: (@device, {@OCTOBLU_ICON_URL}) ->

  get: =>
    logo = @_getLogoFromDevice @device
    if logo.indexOf('http://') > -1
      return @getIconUrl 'unsecure'
    return logo

  getIconUrl: (path) =>
    path = path.replace('.svg', '')
    return "#{@OCTOBLU_ICON_URL}#{path}.svg"

  _getLogoFromDevice: (device) =>
    return @getIconUrl 'other' unless device?
    return device.iconUri if device.iconUri?
    return device.logo if device.logo?
    return device.nodeType?.logo if device?.nodeType?.logo?
    return @getIconUrl 'other' unless device.type?

    type = device.type.replace 'octoblu:', 'device:'
    type = type.replace ':', '/'
    return @getIconUrl type

angular.module('octobluApp').service 'DeviceLogo', (OCTOBLU_ICON_URL) ->
  (options) ->
    new DeviceLogo options, {OCTOBLU_ICON_URL}
