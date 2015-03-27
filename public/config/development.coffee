angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: "http://#{window.location.hostname}:8888"
    GOOGLE: "http://#{window.location.hostname}:8888"
    FACEBOOK: "http://#{window.location.hostname}:8888"
    TWITTER: "http://#{window.location.hostname}:8888"
    GITHUB: "http://#{window.location.hostname}:8888"
  }
  .constant 'OAUTH_PROVIDER', "http://#{window.location.hostname}:9000"
  .constant 'MESHBLU_HOST', "ws://#{window.location.hostname}"
  .constant 'MESHBLU_PORT', '3000'
  .constant 'PROFILE_URI', "http://#{window.location.hostname}:8888/profile"

