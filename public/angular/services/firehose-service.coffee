class FirehoseService extends MeshbluFirehoseSocketIO
  constructor: ($cookies, MESHBLU_FIREHOSE_HOSTNAME, MESHBLU_FIREHOSE_PORT, MESHBLU_FIREHOSE_PROTOCOL) ->
    meshbluConfig =
      hostname: MESHBLU_FIREHOSE_HOSTNAME,
      port: MESHBLU_FIREHOSE_PORT,
      protocol: MESHBLU_FIREHOSE_PROTOCOL,
      uuid: $cookies.meshblu_auth_uuid,
      token: $cookies.meshblu_auth_token

    super {meshbluConfig}
    @connect = _.once @connect

angular.module('octobluApp').service 'FirehoseService', FirehoseService
