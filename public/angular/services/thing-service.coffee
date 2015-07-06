class ThingService
  constructor: ($q, skynetService, OCTOBLU_ICON_URL, $http) ->
    @skynetPromise  = skynetService.getSkynetConnection()
    @q = $q
    @http = $http
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL

  addLogo: (data) =>
    return _.clone data unless data.type?

    filePath = data.type.replace('octoblu:', 'device:').replace ':', '/'
    logo = "#{@OCTOBLU_ICON_URL}#{filePath}.svg"
    _.extend logo: logo, data

  addMessageSchemaFromUrl: (data, callback) =>
    return callback null, _.clone data unless data.messageSchemaUrl?

    @http.get(data.messageSchemaUrl)
    .success (body, status, headers, config) ->
      data.messageSchema = body
      return callback null, data
    .error (body, status, headers, config) ->
      return callback new Error()

  addMessageFormSchemaFromUrl: (data, callback) =>
    data.messageFormSchema ?= ['*']
    return callback null, _.clone data unless data.messageFormSchemaUrl?

    @http.get(data.messageFormSchemaUrl)
    .success (body, status, headers, config) ->
      data.messageFormSchema = body
      return callback null, data
    .error (body, status, headers, config) ->
      return callback new Error()

  calculateTheEverything: (device, peers) =>
    uuid: '*'
    name: 'Everything'
    discover:  !device.discoverWhitelist?
    configure: !device.configureWhitelist?
    send:      !device.sendWhitelist?
    receive:   !device.receiveWhitelist?

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

    @skynetPromise.then (connection) =>
      connection.unregister uuid: device.uuid, =>
        deferred.resolve()

    deferred.promise

  generateSessionToken: (device) =>
    deferred = @q.defer()

    @skynetPromise.then (connection) =>
      connection.generateAndStoreToken uuid: device.uuid, (result) =>
        deferred.resolve result.token

    deferred.promise

  getThing: (query={}) =>
    deferred = @q.defer()

    @skynetPromise.then (connection) =>
      connection.devices query, (result={}) =>
        return deferred.reject error if result.error?
        thing = _.first result.devices
        thing = @addLogo thing
        deferred.resolve thing

    deferred.promise

  getThings: =>
    deferred = @q.defer()

    @skynetPromise.then (connection) =>
      connection.mydevices {}, (results) =>
        [users, devices] = _.partition results.devices, type: 'octoblu:user'

        things = _.union(users, devices)

        things = _.map things, @addLogo

        async.map things, @addMessageSchemaFromUrl, (error, things) =>
          async.map things, @addMessageFormSchemaFromUrl, (error, things) =>
            deferred.resolve things

    deferred.promise

  revokeToken: (uuid, token) =>
    deferred = @q.defer()
    @skynetPromise.then (connection) =>
        connection.revokeToken uuid, token, (result) =>
          return deferred.reject new Error('Failed to revokeToken') unless result?
          deferred.resolve {}
    deferred.promise

  updateDevice: (device={}) =>
    deferred = @q.defer()

    @skynetPromise.then (connection) =>
      connection.update device, =>
        deferred.resolve()

    deferred.promise

  updateDeviceWithPermissionRows: (device, rows) =>
    return @q.when() unless device? && rows?
    @updateDevice(
      uuid: device.uuid
      discoverWhitelist: _.pluck(_.where(rows, discover: true), 'uuid')
      configureWhitelist: _.pluck(_.where(rows, configure: true), 'uuid')
      sendWhitelist: _.pluck(_.where(rows, send: true), 'uuid')
      receiveWhitelist: _.pluck(_.where(rows, receive: true), 'uuid')
    )

angular.module('octobluApp').service 'ThingService', ThingService
