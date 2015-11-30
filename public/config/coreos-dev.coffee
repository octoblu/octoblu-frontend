angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: "http://login.octoblu.dev:53678"
    GOOGLE: "http://login.octoblu.dev:53678"
    FACEBOOK: "http://login.octoblu.dev:53678"
    TWITTER: "http://login.octoblu.dev:53678"
    CITRIX: "http://login.octoblu.dev:53678"
    GITHUB: "http://login.octoblu.dev:53678"
  }
  .constant 'OAUTH_PROVIDER', "http://oauth.octoblu.dev:55871"
  .constant 'MESHBLU_HOST', "172.18.42.1"
  .constant 'MESHBLU_PORT', '64460'
  .constant 'PROFILE_URI', "http://login.octoblu.dev:53678/profile"
  # .constant 'OCTOBLU_ICON_URL', 'http://octoblu-icons.s3.amazonaws.com/'
  .constant 'OCTOBLU_ICON_URL', 'https://ds78apnml6was.cloudfront.net/'
  .constant 'OCTOBLU_API_URL', "http://api.octoblu.dev:53748"
  .constant 'CONNECTOR_DETAIL_SERVICE_URL', 'https://connector.octoblu.com'
  .constant 'FLOW_LOGGER_UUID', 'a9567a97-ca4a-4368-97e1-a77f45d7810f'
  .constant 'GATEBLU_LOGGER_UUID', 'a0ae81c4-45be-4459-9a34-4fd8643a7b73'
  .constant 'REGISTRY_URL', 'http://localhost:9999/registry.json'
