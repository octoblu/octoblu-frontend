angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: "http://email-password-site.octoblu.dev"
    GOOGLE: "http://email-password-site.octoblu.dev"
    FACEBOOK: "http://email-password-site.octoblu.dev"
    TWITTER: "http://email-password-site.octoblu.dev"
    CITRIX: "http://email-password-site.octoblu.dev"
    GITHUB: "http://email-password-site.octoblu.dev"
  }
  .constant 'OAUTH_PROVIDER', "http://oauth.octoblu.dev"
  .constant 'MESHBLU_HOST', "meshblu.octoblu.dev"
  .constant 'MESHBLU_PORT', '80'
  .constant 'OCTOBLU_ICON_URL', 'https://ds78apnml6was.cloudfront.net/'
  .constant 'OCTOBLU_API_URL', "http://app.octoblu.dev"
  .constant 'CONNECTOR_DETAIL_SERVICE_URL', 'https://connector.octoblu.dev'
  .constant 'FLOW_LOGGER_UUID', 'none'
  .constant 'GATEBLU_LOGGER_UUID', 'none'
  .constant 'REGISTRY_URL', 'https://s3-us-west-2.amazonaws.com/nanocyte-registry/latest/registry.json'
  .constant 'CWC_TRUST_URL', 'https://trust-eastus-release-a.tryworkspacesapi.net'
  .constant 'CWC_AUTHENTICATOR_URL', "https://#{window.location.hostname}:3006"
  .constant "CWC_LOGIN_URL", "https://workspace.tryworkspaces.com/login"
