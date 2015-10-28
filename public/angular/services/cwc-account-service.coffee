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
    jwtHelper.decodeToken(token);

  retrieveCustomerProfile: (customer, adminId) =>
    # url = "https://delegatedadministration.#{@CWC_DOMAIN}/#{customer}/Administrators?id=#{adminId}"
    # @http.get url
    #   .then (response) =>
    #     return "yay"
    #   , (error) =>
    #     return error


angular.module('octobluApp').service 'CWCAccountService', CWCAccountService
