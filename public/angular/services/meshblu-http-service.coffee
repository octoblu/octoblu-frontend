class MeshbluHttpService
  create: (options) =>
    new MeshbluHttp options

angular.module('octobluApp').service 'MeshbluHttpService', MeshbluHttpService
