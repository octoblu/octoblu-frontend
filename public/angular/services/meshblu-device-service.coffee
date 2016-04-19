class MeshbluDeviceService
  constructor: ($q, MeshbluHttpService) ->
    @q = $q
    @MeshbluHttpService = MeshbluHttpService

  get: (uuid) =>
    deferred = @q.defer()

    @MeshbluHttpService.device uuid, (error, device) =>
      return deferred.reject(error) if error?
      deferred.resolve device

    deferred.promise

angular.module('octobluApp').service 'MeshbluDeviceService', MeshbluDeviceService
