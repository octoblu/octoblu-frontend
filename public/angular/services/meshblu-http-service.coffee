class MeshbluHttpService extends MeshbluHttp
  constructor: ($cookies, MESHBLU_HOST, MESHBLU_PORT) ->
    super
      uuid: $cookies.meshblu_auth_uuid
      token: $cookies.meshblu_auth_token
      server: MESHBLU_HOST
      port: MESHBLU_PORT

angular.module('octobluApp').service 'MeshbluHttpService', MeshbluHttpService
