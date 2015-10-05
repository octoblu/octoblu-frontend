class ConnectorDetailService
  constructor: ($http, CONNECTOR_DETAIL_SERVICE_URL) ->
    @http = $http
    @CONNECTOR_DETAIL_SERVICE_URL = CONNECTOR_DETAIL_SERVICE_URL

  getDependenciesForPackage: (connector) =>
    return @http.get "#{@CONNECTOR_DETAIL_SERVICE_URL}/#{connector}/dependencies", json: true

angular.module('octobluApp').service 'ConnectorDetailService', ConnectorDetailService
