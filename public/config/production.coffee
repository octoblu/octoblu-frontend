angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: 'https://login.octoblu.com'
    GOOGLE: 'https://google-oauth.octoblu.com/login'
    CITRIX: 'https://citrix-oauth.octoblu.com/login'
    FACEBOOK: 'https://facebook-oauth.octoblu.com/login'
    TWITTER: 'https://twitter-oauth.octoblu.com/login'
    GITHUB: 'https://github-oauth.octoblu.com/login'
  }
  .constant 'SERVICE_UUIDS', {
    TRIGGER: 'b560b6ee-c264-4ed9-b98e-e3376ce6ce64',
    INTERVAL: '765bd3a4-546d-45e6-a62f-1157281083f0',
    CREDENTIALS: 'c339f6ce-fe26-4788-beee-c97605f50403'
  }
  .constant 'OAUTH_PROVIDER', 'https://oauth.octoblu.com'
  .constant 'MESHBLU_HOST', 'meshblu.octoblu.com'
  .constant 'MESHBLU_PORT', '443'
  .constant 'MESHBLU_PROTOCOL', 'https'
  .constant 'MESHBLU_FIREHOSE_HOSTNAME', 'meshblu-firehose-socket-io.octoblu.com'
  .constant 'MESHBLU_FIREHOSE_PORT', '443'
  .constant 'MESHBLU_FIREHOSE_PROTOCOL', 'https'
  .constant 'OCTOBLU_ICON_URL', 'https://ds78apnml6was.cloudfront.net/'
  .constant 'OCTOBLU_API_URL', 'https://app.octoblu.com'
  .constant 'CONNECTOR_DETAIL_SERVICE_URL', 'https://connector.octoblu.com'
  .constant 'FLOW_LOGGER_UUID', 'f952aacb-5156-4072-bcae-f830334376b1'
  .constant 'GATEBLU_LOGGER_UUID', '4dd6d1a8-0d11-49aa-a9da-d2687e8f9caf'
  .constant 'REGISTRY_URL', 'https://s3-us-west-2.amazonaws.com/nanocyte-registry/latest/registry.json'
  .constant 'CWC_TRUST_URL', 'https://trust-eastus-release-a.tryworkspacesapi.net'
  .constant 'CWC_AUTHENTICATOR_URL', "https://cwc-auth.octoblu.com"
  .constant "CWC_LOGIN_URL", "https://workspace.tryworkspaces.com/login"
  .constant "CWC_APP_STORE_URL", "https://cwc-store.octoblu.com"
  .constant "CWC_STAGING_URL", "https://workspace.cloudburrito.com"
  .constant "CWC_PRODUCTION_URL", "https://workspace.cloud.com"
  .constant "CWC_AUTHENTICATOR_PROXY_URL", "https://cwc-authenticator-proxy.octoblu.com"
