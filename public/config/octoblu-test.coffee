return unless location.hostname in ['app.octoblu.test']
protocol = location.protocol.replace(/\W*$/,'')
port = '80'
port = '443' if protocol == 'https'
console.log 'using octoblu-test env'
angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: "#{protocol}://email-password-site.octoblu.test"
    GOOGLE: "#{protocol}://email-password-site.octoblu.test"
    FACEBOOK: "#{protocol}://email-password-site.octoblu.test"
    TWITTER: "#{protocol}://email-password-site.octoblu.test"
    CITRIX: "#{protocol}://email-password-site.octoblu.test"
    GITHUB: "#{protocol}://email-password-site.octoblu.test"
  }
  .constant 'SERVICE_UUIDS', {
    TRIGGER: 'b560b6ee-c264-4ed9-b98e-e3376ce6ce64',
    INTERVAL: '11d64fbe-1633-4e56-ade8-3517e0ff3bae',
    CREDENTIALS: 'c339f6ce-fe26-4788-beee-c97605f50403'
  }
  .constant 'CLUSTER_DOMAIN', 'octoblu.test'
  .constant 'BLUPRINTER_URL', 'https://bluprinter.octoblu.test'
  .constant 'CONNECTOR_DETAIL_SERVICE_URL', "#{protocol}://connector.octoblu.test"
  .constant 'CWC_APP_STORE_URL', "#{protocol}://cwc-store.octoblu.test"
  .constant 'CWC_AUTHENTICATOR_URL', "#{protocol}://cwc-authenticator-proxy.octoblu.test"
  .constant 'CWC_LOGIN_URL', 'https://workspace.tryworkspaces.com/login'
  .constant 'CWC_TRUST_URL', 'https://trust-eastus-release-a.tryworkspacesapi.net'
  .constant 'FLOW_DEPLOY_SERVICE_URL', 'https://nanocyte-flow-deploy.octoblu.test'
  .constant 'FLOW_LOGGER_UUID', 'none'
  .constant 'GATEBLU_LOGGER_UUID', 'none'
  .constant 'INTERCOM_APPID', 'thuyk9s6'
  .constant 'MESHBLU_FIREHOSE_HOSTNAME', "meshblu-firehose-socket-io.octoblu.test"
  .constant 'MESHBLU_FIREHOSE_PORT', port
  .constant 'MESHBLU_FIREHOSE_PROTOCOL', protocol
  .constant 'MESHBLU_HOST', "meshblu.octoblu.test"
  .constant 'MESHBLU_PORT', port
  .constant 'MESHBLU_PROTOCOL', protocol
  .constant 'OAUTH_PROVIDER', "#{protocol}://oauth.octoblu.test"
  .constant 'OCTOBLU_API_URL', "#{protocol}://app.octoblu.test"
  .constant 'OCTOBLU_ICON_URL', 'https://icons.octoblu.com/'
  .constant 'REGISTRY_URL', 'https://s3-us-west-2.amazonaws.com/nanocyte-registry/latest/registry.json'
  .constant "CWC_AUTHENTICATOR_PROXY_URL", "https://cwc-authenticator-proxy.octoblu.test"
  .constant "CWC_PRODUCTION_URL", "https://workspace.cloud.com"
  .constant "CWC_STAGING_URL", "https://workspace.cloudburrito.com"
  .constant 'CONNECTOR_FACTORY_UI', 'https://connector-factory.octoblu.com'
  .constant 'SENTRY_DSN', ''
  .constant 'STATUS_PAGE_ID', 'c3jcws6d2z45'
  .constant 'STATUS_PAGE_URL', 'http://status.octoblu.com'
  .constant 'OCTOBLU_REGISTRY_CONNECTOR_OFFICIAL', 'https://raw.githubusercontent.com/octoblu/registry-meshblu-connector-official/master/registry.json'
  .constant 'OCTOBLU_REGISTRY_CONNECTOR_COMMUNITY', 'https://raw.githubusercontent.com/octoblu/registry-meshblu-connector-community/master/registry.json'
  .constant 'OCTOBLU_REGISTRY_ENDO_OFFICIAL', 'https://raw.githubusercontent.com/octoblu/registry-endo-official/master/registry.json'
  .constant 'OCTOBLU_REGISTRY_ENDO_COMMUNITY', 'https://raw.githubusercontent.com/octoblu/registry-endo-community/master/registry.json'
