return unless location.hostname == 'app.runnable.octoblu.com'
console.log 'using runnable configuration'

angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: 'https://login.runnable.octoblu.com'
  }
