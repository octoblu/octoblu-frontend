angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: "http://#{window.location.hostname}:8888"
    GOOGLE: "http://#{window.location.hostname}:8888"
    FACEBOOK: "http://#{window.location.hostname}:8888"
    TWITTER: "http://#{window.location.hostname}:8888"
    CITRIX: "http://#{window.location.hostname}:8888"
    GITHUB: "http://#{window.location.hostname}:8888"
  }
  .constant 'OAUTH_PROVIDER', "http://#{window.location.hostname}:55871"
  .constant 'MESHBLU_HOST', "#{window.location.hostname}"
  .constant 'MESHBLU_PORT', '3000'
  .constant 'PROFILE_URI', "http://#{window.location.hostname}:8888/profile"
  .constant 'OCTOBLU_ICON_URL', 'https://ds78apnml6was.cloudfront.net/'
  .constant 'OCTOBLU_API_URL', "http://#{window.location.hostname}:8080"
  .constant 'CONNECTOR_DETAIL_SERVICE_URL', 'https://connector.octoblu.com'
  .constant 'FLOW_LOGGER_UUID', 'a9567a97-ca4a-4368-97e1-a77f45d7810f'
  .constant 'GATEBLU_LOGGER_UUID', 'a0ae81c4-45be-4459-9a34-4fd8643a7b73'
  .constant 'REGISTRY_URL', 'http://localhost:9999/registry.json'
  .constant 'CWC_TRUST_URL', 'https://trust-eastus-release-a.tryworkspacesapi.net'
  .constant 'CWC_AUTHENTICATOR_URL', "https://#{window.location.hostname}:3006"
