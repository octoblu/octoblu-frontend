class ThingService
  constructor: ($q, skynetService, OCTOBLU_ICON_URL) ->
    @skynetPromise  = skynetService.getSkynetConnection()
    @q = $q
    @OCTOBLU_ICON_URL = OCTOBLU_ICON_URL

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

  addLogo: (data) =>
    return _.clone data unless data.type?

    filePath = data.type.replace('octoblu:', 'device:').replace ':', '/'
    logo = "#{@OCTOBLU_ICON_URL}#{filePath}.svg"
    _.extend logo: logo, data


angular.module('octobluApp').service 'ThingService', ThingService


