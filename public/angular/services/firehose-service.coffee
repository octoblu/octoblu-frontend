class FirehoseService extends MeshbluFirehoseSocketIO
  constructor: ($cookies, $rootScope, MESHBLU_FIREHOSE_HOSTNAME, MESHBLU_FIREHOSE_PORT, MESHBLU_FIREHOSE_PROTOCOL) ->
    @rootScope = $rootScope
    meshbluConfig =
      hostname: MESHBLU_FIREHOSE_HOSTNAME,
      port: MESHBLU_FIREHOSE_PORT,
      protocol: MESHBLU_FIREHOSE_PROTOCOL,
      uuid: $cookies.meshblu_auth_uuid,
      token: $cookies.meshblu_auth_token

    super {meshbluConfig}
    @connect = _.once @connect

  emit: =>
    super
    @rootScope.$applyAsync()

angular.module('octobluApp').service 'FirehoseService', FirehoseService
