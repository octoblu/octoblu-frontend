return unless location.hostname == 'app.hpe.octoblu.com'
console.log 'using hpe configuration'

angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: 'https://login.hpe.octoblu.com'
    GOOGLE: 'https://google-oauth.hpe.octoblu.com/login'
    CITRIX: 'https://citrix-oauth.hpe.octoblu.com/login'
    FACEBOOK: 'https://facebook-oauth.hpe.octoblu.com/login'
    TWITTER: 'https://twitter-oauth.hpe.octoblu.com/login'
    GITHUB: 'https://github-oauth.hpe.octoblu.com/login'
  }
  .constant 'SERVICE_UUIDS', {
    TRIGGER: '6afb5069-36c7-4d0c-8406-adc6cccb4155',
    INTERVAL: '8b807eae-f50a-46df-b025-bf15f67146a9',
    CREDENTIALS: '7f5fa746-c537-4d7c-aabc-25880592b2d5'
  }
  .constant 'BLUPRINTER_URL', 'https://bluprinter.hpe.octoblu.com'
  .constant 'CONNECTOR_DETAIL_SERVICE_URL', 'https://connector.hpe.octoblu.com'
  .constant 'CWC_AUTHENTICATOR_URL', "https://cwc-auth.hpe.octoblu.com"
  .constant 'CWC_TRUST_URL', 'https://trust-eastus-release-a.tryworkspacesapi.net'
  .constant 'FLOW_LOGGER_UUID', 'f952aacb-5156-4072-bcae-f830334376b1'
  .constant 'GATEBLU_LOGGER_UUID', '4dd6d1a8-0d11-49aa-a9da-d2687e8f9caf'
  .constant 'INTERCOM_APPID', 'ux5bbkjz'
  .constant 'MESHBLU_FIREHOSE_HOSTNAME', 'meshblu-firehose-socket-io.hpe.octoblu.com'
  .constant 'MESHBLU_FIREHOSE_PORT', '443'
  .constant 'MESHBLU_FIREHOSE_PROTOCOL', 'https'
  .constant 'MESHBLU_HOST', 'meshblu-http.hpe.octoblu.com'
  .constant 'MESHBLU_PORT', '443'
  .constant 'MESHBLU_PROTOCOL', 'https'
  .constant 'OAUTH_PROVIDER', 'https://oauth.hpe.octoblu.com'
  .constant 'OCTOBLU_API_URL', 'https://app.hpe.octoblu.com'
  .constant 'OCTOBLU_ICON_URL', 'https://icons.hpe.octoblu.com/'
  .constant 'REGISTRY_URL', 'https://s3-us-west-2.amazonaws.com/nanocyte-registry/latest/registry.json'
  .constant "CWC_APP_STORE_URL", "https://cwc-store.hpe.octoblu.com"
  .constant "CWC_AUTHENTICATOR_PROXY_URL", "https://cwc-authenticator-proxy.hpe.octoblu.com"
  .constant "CWC_LOGIN_URL", "https://workspace.hpe.tryworkspaces.com/login"
  .constant "CWC_PRODUCTION_URL", "https://workspace.hpe.cloud.com"
  .constant "CWC_STAGING_URL", "https://workspace.hpe.cloudburrito.com"
  .constant 'CONNECTOR_FACTORY_UI', 'https://connector-factory.hpe.octoblu.com'
  .constant 'SENTRY_DSN', 'https://0a67cc3d923040a886bbf04ba3456734@app.getsentry.com/87643'
  .constant 'OCTOBLU_REGISTRY_CONNECTOR_OFFICIAL', 'https://raw.githubusercontent.com/octoblu/registry-meshblu-connector-official/master/registry.json'
  .constant 'OCTOBLU_REGISTRY_CONNECTOR_COMMUNITY', 'https://raw.githubusercontent.com/octoblu/registry-meshblu-connector-community/master/registry.json'
  .constant 'OCTOBLU_REGISTRY_ENDO_OFFICIAL', 'https://raw.githubusercontent.com/octoblu/registry-endo-official/master/registry.json'
  .constant 'OCTOBLU_REGISTRY_ENDO_COMMUNITY', 'https://raw.githubusercontent.com/octoblu/registry-endo-community/master/registry.json'
