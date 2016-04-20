class ThingService
  constructor: ($q, OCTOBLU_ICON_URL, MESHBLU_HOST, MESHBLU_PORT, MeshbluHttpService, $cookies) ->
    @q = $q
    @cookies = $cookies
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL
    @MeshbluHttp = MeshbluHttp
    @MESHBLU_HOST = MESHBLU_HOST
    @MESHBLU_PORT = MESHBLU_PORT
    @MeshbluHttpService = MeshbluHttpService

  addLogo: (data) =>
    return _.clone data unless data?.type?

    filePath = data.type.replace('octoblu:', 'device:').replace ':', '/'
    logo = "#{@OCTOBLU_ICON_URL}#{filePath}.svg"
    _.extend logo: logo, data

  addUuidToWhitelists: (uuid, device={}) =>
    thing = {}
    thing.owner = uuid
    thing.discoverWhitelist  = _.union [uuid], device.discoverWhitelist ? []
    thing.configureWhitelist = _.union [uuid], device.configureWhitelist ? []
    thing.sendWhitelist      = _.union [uuid], device.sendWhitelist ? []
    thing.receiveWhitelist   = _.union [uuid], device.receiveWhitelist ? []
    _.pull thing.discoverWhitelist, '*'
    _.pull thing.configureWhitelist, '*'
    _.pull thing.sendWhitelist, '*'
    _.pull thing.receiveWhitelist, '*'
    thing

  calculateTheEverything: (device, peers) =>
    uuid: '*'
    name: 'Everything'
    type: 'Octoblu'
    discover:  !device.discoverWhitelist?
    configure: !device.configureWhitelist?
    send:      !device.sendWhitelist?
    receive:   !device.receiveWhitelist?

  claimThing: (query={}, user, params)=>
    {uuid, token} = query
    return @q.reject 'Unable to claim device, missing uuid'  unless uuid?
    return @q.reject 'Unable to claim device, missing token' unless token?
    deferred = @q.defer()
    meshbluHttp = new @MeshbluHttp {
      hostname: @MESHBLU_HOST,
      port: @MESHBLU_PORT,
      uuid: uuid,
      token: token
    }
    meshbluHttp.whoami (error, thing) =>
      return deferred.reject error if error?
      thing = @addUuidToWhitelists user.uuid, thing
      thing.name = params.name
      meshbluHttp.update uuid, thing, (error) =>
        return deferred.reject error if error?
        deferred.resolve()
    return deferred.promise

  combineDeviceWithPeers: (device, peers) =>
    return unless device? && peers?

    rows = []
    rows.push @calculateTheEverything(device, peers)

    _.each peers, (peer) =>
      rows.push {uuid: peer.uuid, name: peer.name, type: peer.type, discover: false, configure: false, send: false, receive: false}

    _.each device.discoverWhitelist, (uuid) =>
      rows = @_updateWhitelistOnRows rows, 'discover', uuid

    _.each device.configureWhitelist, (uuid) =>
      rows = @_updateWhitelistOnRows rows, 'configure', uuid

    _.each device.sendWhitelist, (uuid) =>
      rows = @_updateWhitelistOnRows rows, 'send', uuid

    _.each device.receiveWhitelist, (uuid) =>
      rows = @_updateWhitelistOnRows rows, 'receive', uuid

    sortedRows = []

    [everything,rows] = _.partition rows, uuid: '*'
    [users,devices] = _.partition rows, (row) -> _.contains ['octoblu:user','user'], row.type
    users = _.sortBy users, 'uuid'
    devices = _.sortBy devices, 'uuid'
    _.union everything, users, devices

  _updateWhitelistOnRows: (rows, whitelistName, uuid) =>
    # _updateWhitelistOnRows could do in place modifications
    # to rows. Might be much faster, so look here if it's slow
    rows = _.cloneDeep rows
    row = _.find rows, uuid: uuid
    unless row?
      row = {uuid: uuid, discover: false, configure: false, send: false, receive: false}
      rows.push row
    row[whitelistName] = true
    rows

  deleteThing: (device) =>
    deferred = @q.defer()

    @MeshbluHttpService.unregister device.uuid, (error) =>
      if error?
        console.error "Error unregistering: #{device.uuid}", error.stack()
        deferred.reject error
        return

      deferred.resolve()

    deferred.promise

  generateSessionToken: (device) =>
    deferred = @q.defer()

    @MeshbluHttpService.generateAndStoreToken device.uuid, {tag: 'app.octoblu.com'}, (error, token) =>
      if error?
        console.error "Error generating session token: #{device.uuid}", error.stack()
        deferred.reject error
        return
      deferred.resolve token

    deferred.promise

  getThing: ({uuid}) =>
    deferred = @q.defer()

    @MeshbluHttpService.device uuid, (error, thing) =>
      return deferred.reject error if error?
      thing = @addLogo thing
      deferred.resolve thing

    deferred.promise

  getThings: (query={})=>
    deferred = @q.defer()

    query = _.clone query
    query.owner = @cookies.meshblu_auth_uuid
    @MeshbluHttpService.devices query, (error, results) =>
      return deferred.reject error if error?
      [users, devices] = _.partition results, type: 'octoblu:user'

      things = _.union(users, devices)

      things = _.map things, @addLogo

      deferred.resolve things

    deferred.promise

  revokeToken: (device={}) =>
    deferred = @q.defer()
    @MeshbluHttpService.revokeToken device, (error, result) =>
      return deferred.reject(error) if error?
      deferred.resolve {}
    deferred.promise

  updateDevice: (device={}) =>
    deferred = @q.defer()
    @MeshbluHttpService.update device.uuid, device, (error, response) =>
      if error?
        console.error "Error updating device: #{device.uuid}", error.stack()
        deferred.reject error
        return
      deferred.resolve()

    deferred.promise

  updateDeviceWithPermissionRows: (device, rows) =>
    return @q.when() unless device? && rows?
    uncategorizedRows = _.flatten(_.valuesIn rows)

    @updateDevice(
      uuid: device.uuid
      discoverWhitelist: _.pluck(_.where(uncategorizedRows, discover: true), 'uuid')
      configureWhitelist: _.pluck(_.where(uncategorizedRows, configure: true), 'uuid')
      sendWhitelist: _.pluck(_.where(uncategorizedRows, send: true), 'uuid')
      receiveWhitelist: _.pluck(_.where(uncategorizedRows, receive: true), 'uuid')
    )

angular.module('octobluApp').service 'ThingService', ThingService
