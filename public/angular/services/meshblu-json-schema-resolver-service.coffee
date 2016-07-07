angular.module('octobluApp').service 'MeshbluJsonSchemaResolverService', ($q) ->
  class MeshbluJsonSchemaResolverService extends window.MeshbluJsonSchemaResolver
    resolve: (device) =>
      $q (resolve, reject) =>
        super device, (error, resolvedDevice) =>
          return reject error if error?
          resolve resolvedDevice
