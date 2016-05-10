class OperationNodeService
  constructor: (OCTOBLU_API_URL, $http)->
    @http = $http
    @OCTOBLU_API_URL = OCTOBLU_API_URL

  fetch: =>
    @http.get "#{@OCTOBLU_API_URL}/api/operations", cache: true
      .then ({data}) =>
        return data

angular.module('octobluApp').service 'OperationNodeService', OperationNodeService
