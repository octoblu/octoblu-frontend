class OperationNodeService
  constructor: (OCTOBLU_API_URL, $http, DeviceLogo)->
    @http = $http
    @OCTOBLU_API_URL = OCTOBLU_API_URL
    @DeviceLogo = DeviceLogo

  fetch: =>
    @http.get "#{@OCTOBLU_API_URL}/api/operations", cache: true
      .then ({data}) =>
        _.map data, (item) =>
          item.logo = new @DeviceLogo(item).get();
          return item

angular.module('octobluApp').service 'OperationNodeService', OperationNodeService
