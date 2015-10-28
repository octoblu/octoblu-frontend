class CWCAccountService
  constructor: ($http, CWC_DOMAIN, CWC_TRUST_URL) ->
    @http = $http
    @CWC_DOMAIN = CWC_DOMAIN
    @CWC_TRUST_URL = CWC_TRUST_URL

  validateToken: (token, customer) =>
    url = "#{@CWC_TRUST_URL}/#{customer}/Tokens"
    return @http.get url, json: true

  retrieveCustomerProfile: =>


angular.module('octobluApp').service 'CWCAccountService', CWCAccountService
