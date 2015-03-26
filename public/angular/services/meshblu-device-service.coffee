class MeshbluDeviceService
  constructor: (skynetService, $q) ->
    @skynetPromise = skynetService.getSkynetConnection()
    @q             = $q

  get: (uuid) =>
    deferred = @q.defer()

    @skynetPromise.then (connection) =>
      connection.devices uuid: uuid, (result) =>
        return deferred.reject(new Error("No devices found")) if _.isEmpty(result.devices)
        deferred.resolve _.first result.devices

    deferred.promise

angular.module('octobluApp').service 'MeshbluDeviceService', MeshbluDeviceService


