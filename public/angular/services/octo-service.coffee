class OctoService
  constructor: ($http, $q, OCTOBLU_API_URL, deviceService) ->
    @http = $http
    @q = $q
    @OCTOBLU_API_URL = OCTOBLU_API_URL
    @deviceService = deviceService

  add: =>
    @http
      .post "#{@OCTOBLU_API_URL}/api/octos"
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
    @http.delete "#{@OCTOBLU_API_URL}/api/octos/#{octo.uuid}"

angular.module('octobluApp').service 'OctoService', OctoService
