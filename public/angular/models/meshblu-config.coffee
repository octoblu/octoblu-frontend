angular.module('octobluApp').service 'meshbluConfig', (MESHBLU_HOST, MESHBLU_PORT, $cookies) ->
  return {
    uuid: $cookies.meshblu_auth_uuid
    token: $cookies.meshblu_auth_token
    hostname: MESHBLU_HOST
    port: MESHBLU_PORT
  }
