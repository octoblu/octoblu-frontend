angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: 'https://login.octoblu.com'
    GOOGLE: 'https://google-oauth.octoblu.com/login'
    FACEBOOK: 'https://facebook-oauth.octoblu.com/login'
    TWITTER: 'https://twitter-oauth.octoblu.com/login'
    GITHUB: 'https://github-oauth.octoblu.com/login'
  }
  .constant 'MESHBLU_HOST', 'wss://meshblu.octoblu.com'
  .constant 'MESHBLU_PORT', '443'
