protocol = location.protocol.replace(/\W*$/,'')
port = '80'
port = '443' if protocol == 'https'

angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: "#{protocol}://email-password-site.octoblu.dev"
    GOOGLE: "#{protocol}://email-password-site.octoblu.dev"
    FACEBOOK: "#{protocol}://email-password-site.octoblu.dev"
    TWITTER: "#{protocol}://email-password-site.octoblu.dev"
    CITRIX: "#{protocol}://email-password-site.octoblu.dev"
    GITHUB: "#{protocol}://email-password-site.octoblu.dev"
  }
  .constant 'SERVICE_UUIDS', {
    TRIGGER: 'b560b6ee-c264-4ed9-b98e-e3376ce6ce64',
    INTERVAL: '11d64fbe-1633-4e56-ade8-3517e0ff3bae',
    CREDENTIALS: 'c339f6ce-fe26-4788-beee-c97605f50403'
  }
  .constant 'BLUPRINTER_URL', 'https://bluprinter.octoblu.dev'
  .constant 'CONNECTOR_DETAIL_SERVICE_URL', "#{protocol}://connector.octoblu.dev"
  .constant 'CWC_APP_STORE_URL', "#{protocol}://cwc-store.octoblu.dev"
  .constant 'CWC_AUTHENTICATOR_URL', "#{protocol}://cwc-authenticator-proxy.octoblu.dev"
  .constant 'CWC_LOGIN_URL', 'https://workspace.tryworkspaces.com/login'
  .constant 'CWC_TRUST_URL', 'https://trust-eastus-release-a.tryworkspacesapi.net'
  .constant 'FLOW_LOGGER_UUID', 'none'
  .constant 'GATEBLU_LOGGER_UUID', 'none'
  .constant 'INTERCOM_APPID', 'thuyk9s6'
  .constant 'MESHBLU_FIREHOSE_HOSTNAME', "meshblu-firehose-socket-io.octoblu.dev"
  .constant 'MESHBLU_FIREHOSE_PORT', port
  .constant 'MESHBLU_FIREHOSE_PROTOCOL', protocol
  .constant 'MESHBLU_HOST', "meshblu.octoblu.dev"
  .constant 'MESHBLU_PORT', port
  .constant 'MESHBLU_PROTOCOL', protocol
  .constant 'OAUTH_PROVIDER', "#{protocol}://oauth.octoblu.dev"
  .constant 'OCTOBLU_API_URL', "#{protocol}://app.octoblu.dev"
  .constant 'OCTOBLU_ICON_URL', 'https://icons.octoblu.com/'
  .constant 'REGISTRY_URL', 'https://s3-us-west-2.amazonaws.com/nanocyte-registry/latest/registry.json'
  .constant "CWC_AUTHENTICATOR_PROXY_URL", "https://cwc-authenticator-proxy.octoblu.dev"
  .constant "CWC_PRODUCTION_URL", "https://workspace.cloud.com"
  .constant "CWC_STAGING_URL", "https://workspace.cloudburrito.com"
  .constant 'CONNECTOR_FACTORY_UI', 'https://connector-factory.octoblu.com'
  .constant 'OCTOBLU_CONNECTOR_OFFICIAL_REGISTRY', 'https://raw.githubusercontent.com/octoblu/meshblu-connector-official-registry/master/registry.json'
