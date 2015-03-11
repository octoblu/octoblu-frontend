angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: 'http://localhost:8888'
    GOOGLE: 'http://localhost:8888'
    FACEBOOK: 'http://localhost:8888'
    TWITTER: 'http://localhost:8888'
    GITHUB: 'http://localhost:8888'  
  }
  .constant 'MESHBLU_HOST', "ws://${window.location.hostname}"
  .constant 'MESHBLU_PORT', '3000'

