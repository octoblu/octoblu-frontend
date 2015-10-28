class CWCAccountService
  constructor: ($http, CWC_DOMAIN) ->
    @http = $http
    @CWC_DOMAIN = CWC_DOMAIN

  validateToken: =>

  retrieveCustomerProfile: =>

  getDependenciesForPackage: (connector) =>
    url = "#{@CONNECTOR_DETAIL_SERVICE_URL}/#{connector}/dependencies"
    return @http.get url, json: true

angular.module('octobluApp').service 'CWCAccountService', CWCAccountService
