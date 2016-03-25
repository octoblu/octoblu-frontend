angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: "http://#{window.location.hostname}:8888"
    GOOGLE: "http://#{window.location.hostname}:8888"
    FACEBOOK: "http://#{window.location.hostname}:8888"
    TWITTER: "http://#{window.location.hostname}:8888"
    CITRIX: "http://#{window.location.hostname}:8888"
    GITHUB: "http://#{window.location.hostname}:8888"
  }
  .constant 'SERVICE_UUIDS', {
    TRIGGER: 'b560b6ee-c264-4ed9-b98e-e3376ce6ce64',
    INTERVAL: '11d64fbe-1633-4e56-ade8-3517e0ff3bae',
    CREDENTIALS: 'c339f6ce-fe26-4788-beee-c97605f50403'
  }
  .constant 'OAUTH_PROVIDER', "http://#{window.location.hostname}:55871"
  .constant 'MESHBLU_HOST', "#{window.location.hostname}"
  .constant 'MESHBLU_PORT', '3000'
  .constant 'OCTOBLU_ICON_URL', 'https://ds78apnml6was.cloudfront.net/'
  .constant 'OCTOBLU_API_URL', "http://#{window.location.hostname}:8080"
  .constant 'CONNECTOR_DETAIL_SERVICE_URL', 'https://connector.octoblu.com'
  .constant 'FLOW_LOGGER_UUID', 'a9567a97-ca4a-4368-97e1-a77f45d7810f'
  .constant 'GATEBLU_LOGGER_UUID', 'a0ae81c4-45be-4459-9a34-4fd8643a7b73'
  .constant 'REGISTRY_URL', 'http://localhost:9999/registry.json'
  .constant 'CWC_TRUST_URL', 'https://trust-eastus-release-a.tryworkspacesapi.net'
  .constant 'CWC_AUTHENTICATOR_URL', "https://#{window.location.hostname}:3006"
  .constant "CWC_LOGIN_URL", "https://workspace.tryworkspaces.com/login"
  .constant "APP_STORE_URL", "http://localhost:6040/"
  .constant "CWC_APP_STORE_URL", "http://localhost:6041/"
  .constant "CWC_STAGING_URL", "https://workspace.cloudburrito.com"
  .constant "CWC_PRODUCTION_URL", "https://workspace.cloud.com"
  .constant "CWC_AUTHENTICATOR_PROXY_URL", "https://cwc-authenticator-proxy.octoblu.com/"
