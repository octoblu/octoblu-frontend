class ThingService
  constructor: ($q, skynetService, OCTOBLU_ICON_URL) ->
    @skynetPromise  = skynetService.getSkynetConnection()
    @q = $q
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL

  addLogo: (data) =>
    return _.clone data unless data.type?

    filePath = data.type.replace('octoblu:', 'device:').replace ':', '/'
    logo = "#{@OCTOBLU_ICON_URL}#{filePath}.svg"
    _.extend logo: logo, data

  deleteThing: (device) =>
    deferred = @q.defer()

    @skynetPromise.then (connection) =>
      connection.unregister uuid: device.uuid, =>
        deferred.resolve()

    deferred.promise


  extractWhitelist: (permission) =>
    return _.keys _.pick(permission, _.identity)

  generateSessionToken: (device) =>
    deferred = @q.defer()

    @skynetPromise.then (connection) =>
      connection.generateAndStoreToken uuid: device.uuid, (result) =>
        deferred.resolve result.token

    deferred.promise

  getThings: =>
    deferred = @q.defer()

    @skynetPromise.then (connection) =>
      connection.mydevices {}, (results) =>
        everything  = uuid: '*', name: 'Everything', type: 'everything'

        [users, devices] = _.partition results.devices, type: 'octoblu:user'

        things = _.union([everything], users, devices)

        things = _.map things, @addLogo

        deferred.resolve things

    deferred.promise

  mapWhitelistsToPermissions: (device) =>
    return null unless device?

    {
      send:      @whitelistToPermission device.sendWhitelist
      receive:   @whitelistToPermission device.receiveWhitelist
      configure: @whitelistToPermission device.configureWhitelist
      discover:  @whitelistToPermission device.discoverWhitelist
    }

  updateDevice: (device={}) =>
    deferred = @q.defer()

    @skynetPromise.then (connection) =>
      connection.update device, =>
        deferred.resolve()

    deferred.promise

  updateDeviceWithPermissions: (device={}, permissions={}) =>
    @updateDevice(
      uuid: device.uuid
      discoverWhitelist:  @extractWhitelist(permissions.discover)
      configureWhitelist: @extractWhitelist(permissions.configure)
      sendWhitelist:      @extractWhitelist(permissions.send)
      receiveWhitelist:   @extractWhitelist(permissions.receive)
    )

  whitelistToPermission: (whitelist) =>
    return {'*': true} unless whitelist?

    permission = {}
    _.each whitelist, (uuid) =>
      permission[uuid] = true

    permission

angular.module('octobluApp').service 'ThingService', ThingService
