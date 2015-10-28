class CWCAccountService
  constructor: ($http, CWC_DOMAIN, CWC_TRUST_URL, jwtHelper) ->
    @http = $http
    @CWC_DOMAIN = CWC_DOMAIN
    @CWC_TRUST_URL = CWC_TRUST_URL

  validateToken: (token, customer) =>
    url = "#{@CWC_TRUST_URL}/#{customer}/Tokens"
    options =
      headers:
        "Authorization": "CWSAuth bearer=#{token}"
      json: true

    @http
      .get(url, options)
      .then (response) => response.data,
      (error) => error if error?

  decodeToken: (token) =>
    jwtHelper.decodeToken token

angular.module('octobluApp').service 'CWCAccountService', CWCAccountService
