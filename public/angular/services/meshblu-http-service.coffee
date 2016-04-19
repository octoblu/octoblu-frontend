class MeshbluHttpService extends MeshbluHttp
  constructor: ($cookies, MESHBLU_HOST, MESHBLU_PORT) ->
    options =
      uuid: $cookies.meshblu_auth_uuid
      token: $cookies.meshblu_auth_token
      hostname: MESHBLU_HOST
      port: MESHBLU_PORT
    super options

angular.module('octobluApp').service 'MeshbluHttpService', MeshbluHttpService
