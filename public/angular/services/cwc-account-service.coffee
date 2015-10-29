class CWCAccountService
  constructor: ($http, $window, CWC_DOMAIN, CWC_TRUST_URL, OCTOBLU_API_URL) ->
    @http = $http
    @window = $window
    @CWC_DOMAIN = CWC_DOMAIN
    @CWC_TRUST_URL = CWC_TRUST_URL
    @OCTOBLU_API_URL = OCTOBLU_API_URL

  createOctobluSession: (token) =>
    return unless token?
    url = "http://#{@window.location.hostname}:3006/devices"
    options =
       callbackUrl: "#{@OCTOBLU_API_URL}/api/session"
       token: token
    @http.post url, options

  validateToken: (token, customer) =>
    url = "#{@CWC_TRUST_URL}/#{customer}/Tokens"
    options =
      headers:
        "Authorization": "CWSAuth bearer=#{token}"
      json: true

    @http
      .get(url, options)
      .then (response) => console.log response.data,
      (error) => error if error?


angular.module('octobluApp').service 'CWCAccountService', CWCAccountService
