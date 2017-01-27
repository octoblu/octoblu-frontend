class ThingService
  constructor: ($q, MESHBLU_HOST, MESHBLU_PORT, MeshbluHttpService, $cookies, DeviceLogo) ->
    @q = $q
    @cookies = $cookies
    @MeshbluHttp = MeshbluHttp
    @MESHBLU_HOST = MESHBLU_HOST
    @MESHBLU_PORT = MESHBLU_PORT
    @MeshbluHttpService = MeshbluHttpService
    @DeviceLogo = DeviceLogo

  addLogo: (data) =>
    data.logo = new @DeviceLogo(data).get()
    data

  addUuidToWhitelists: (uuid, device={}) =>
    deviceVersion = _.get(device, 'meshblu.version')
    return @addUuidToV2Whitelists uuid, device if deviceVersion == '2.0.0'
    return @addUuidToV1Whitelists uuid, device

  addUuidToV1Whitelists: (uuid, device={}) =>
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
    return thing

  addUuidToV2Whitelists: (uuid, device={}) =>
    thing = {}
    thing.owner = uuid
    thing = @_removeStarFromV2Whitelist thing, 'broadcast.as', device
    thing = @_removeStarFromV2Whitelist thing, 'broadcast.received', device
    thing = @_removeStarFromV2Whitelist thing, 'broadcast.sent', device
    thing = @_removeStarFromV2Whitelist thing, 'discover.as', device
    thing = @_addToV2Whitelist thing, 'discover.view', uuid, device
    thing = @_removeStarFromV2Whitelist thing, 'configure.as', device
    thing = @_addToV2Whitelist thing, 'configure.update', uuid, device
    thing = @_removeStarFromV2Whitelist thing, 'configure.received', device
    thing = @_removeStarFromV2Whitelist thing, 'configure.sent', device
    thing = @_removeStarFromV2Whitelist thing, 'message.as', device
    thing = @_removeStarFromV2Whitelist thing, 'message.from', device
    thing = @_removeStarFromV2Whitelist thing, 'message.received', device
    thing = @_removeStarFromV2Whitelist thing, 'message.sent', device
    return thing

  _addToV2Whitelist: (thing, key, uuid, device={}) =>
    key = "meshblu.whitelists.#{key}"
    thing = _.cloneDeep thing
    existing = _.get(device, key, [])
    updated = _.reject existing, { uuid }
    updated = _.reject updated, { uuid: '*' }
    updated.push { uuid }
    thing[key] = updated
    return thing

  _removeStarFromV2Whitelist: (thing, key, device={}) =>
    key = "meshblu.whitelists.#{key}"
    thing = _.cloneDeep thing
    existing =  _.get(device, key, [])
    updated = _.reject existing, { uuid: '*' }
    thing[key] = updated
    return thing

  calculateTheEverything: (device, peers) =>
    uuid: '*'
    name: 'Everything'
    type: 'Octoblu'
    discover:  !device.discoverWhitelist?
    configure: !device.configureWhitelist?
    send:      !device.sendWhitelist?
    receive:   !device.receiveWhitelist?

  claimThing: (query={}, user, params, meshbluHttp)=>
    {uuid, token} = query
    return @q.reject 'Unable to claim device, missing uuid'  unless uuid?
    return @q.reject 'Unable to claim device, missing token' unless token?
    @q (resolve, reject) =>
      meshbluHttp ?= new @MeshbluHttp {
        hostname: @MESHBLU_HOST,
        port: @MESHBLU_PORT,
        uuid: uuid,
        token: token
      }
      meshbluHttp.whoami (error, thing) =>
        return reject error if error?
        thing = @addUuidToWhitelists user.uuid, thing
        thing.name = params.name
        meshbluHttp.update uuid, thing, (error) =>
          return reject error if error?
          resolve()

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
    @q (resolve, reject) =>

      @MeshbluHttpService.unregister device.uuid, (error) =>
        return reject error if error?
        resolve()

  generateSessionToken: (device, metadata={}) =>
    @q (resolve, reject) =>
      metadata.tag ?= 'app.octoblu.com'

      @MeshbluHttpService.generateAndStoreToken device.uuid, metadata, (error, token) =>
        return reject error if error?
        resolve token

  getThing: ({uuid}) =>
    @q (resolve, reject) =>
      @MeshbluHttpService.device uuid, (error, thing) =>
        return reject error if error?
        thing = @addLogo thing
        resolve thing

  search: ({query, projection}) =>
    @q (resolve, reject) =>
      @MeshbluHttpService.search {query, projection}, (error, things) =>
        return reject error if error?
        resolve _.map things, @addLogo

  getThings: (query={}, projection) =>
    @q (resolve, reject) =>
      query = _.clone query
      query.owner = @cookies.meshblu_auth_uuid
      @MeshbluHttpService.search {query, projection}, (error, results) =>
        return reject error if error?
        [users, devices] = _.partition results, type: 'octoblu:user'
        things = _.union(users, devices)
        things = _.map things, @addLogo
        resolve things

  revokeToken: (device={}) =>
    @q (resolve, reject) =>
      @MeshbluHttpService.revokeToken device, (error, result) =>
        return reject(error) if error?
        resolve {}

  registerThing: (data) =>
    @q (resolve, reject) =>
      data.owner = @cookies.meshblu_auth_uuid

      @MeshbluHttpService.register data, (error, result) =>
        return reject(error) if error?
        resolve result

  updateDevice: (device={}) =>
    @q (resolve, reject) =>
      @MeshbluHttpService.update device.uuid, device, (error, response) =>
        return reject error if error?
        resolve()

  updateDangerously: (uuid, update) =>
    @q (resolve, reject) =>
      @MeshbluHttpService.updateDangerously uuid, update, (error) =>
        return reject(error) if error?
        resolve()

  updateDeviceWithPermissionRows: (device, rows) =>
    return @q.when(false) unless device? && rows?
    return @q.when(false) if _.get(device, 'meshblu.version') == '2.0.0'
    uncategorizedRows = _.flatten(_.valuesIn rows)

    update =
      uuid: device.uuid
      discoverWhitelist: _.pluck(_.where(uncategorizedRows, discover: true), 'uuid')
      configureWhitelist: _.pluck(_.where(uncategorizedRows, configure: true), 'uuid')
      sendWhitelist: _.pluck(_.where(uncategorizedRows, send: true), 'uuid')
      receiveWhitelist: _.pluck(_.where(uncategorizedRows, receive: true), 'uuid')

    return @q.when(false) if @whitelistsAreSame device, update

    @updateDevice update
      .then =>
        return true

  whitelistsAreSame: (device, whitelists) =>
    _.every ['discoverWhitelist', 'configureWhitelist', 'receiveWhitelist', 'sendWhitelist'], (whitelist) =>
      _.isEqual device[whitelist], whitelists[whitelist]

angular.module('octobluApp').service 'ThingService', ThingService
