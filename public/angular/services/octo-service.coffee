class OctoService
  constructor: ($http, $q, deviceService) ->
    @http = $http
    @q = $q
    @deviceService = deviceService

  add: =>
    @http
      .post "/api/octos"
      .then (response) =>
        response.data

  list: =>
    deferred = @q.defer()
    @deviceService.getDevices()
      .then (devices) =>
        octos = _.where devices, type: 'octoblu:octo'
        deferred.resolve(octos)
      .catch (error) =>
        deferred.reject new Error('Error retrieving octos')
    deferred.promise

  remove: (octo) =>
    @deviceService
      .unregisterDevice(octo)
      .then =>
        @http.delete "/api/octos/#{octo.uuid}"

angular.module('octobluApp').service 'OctoService', OctoService
