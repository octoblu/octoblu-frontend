angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: 'http://localhost:8888'
    GOOGLE: 'http://localhost:8888'
    FACEBOOK: 'http://localhost:8888'
    TWITTER: 'http://localhost:8888'
    GITHUB: 'http://localhost:8888'
  }
  .constant 'OAUTH_PROVIDER', 'http://localhost:9000'
  .constant 'MESHBLU_HOST', "ws://#{window.location.hostname}"
  .constant 'MESHBLU_PORT', '3000'
  .constant 'PROFILE_URI', 'http://localhost:8888/profile'

