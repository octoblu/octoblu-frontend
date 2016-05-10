class NodeService
  constructor: (OCTOBLU_API_URL, $q, $http, deviceService) ->
    @OCTOBLU_API_URL = OCTOBLU_API_URL
    @q = $q
    @http = $http
    @deviceService = deviceService
    @getNodesQueue = async.queue @_getNodesAndCache

  getNodes: (options) =>
    return @q.when @nodes if @nodes?

    @q (resolve) =>
      @getNodesQueue.push {}, =>
        resolve @nodes

  _getNodesAndCache: (task, callback) =>
    return callback() if @nodes?
    @http.get @OCTOBLU_API_URL + '/api/nodes'
      .then (results) =>
        @deviceService.clearCache()
        _.each results.data, @deviceService.addOrUpdateDevice
        @deviceService.getDevices()
      .then (@nodes) =>
        setTimeout =>
          delete @nodes
        , 10000
        callback()
      .catch callback

angular.module('octobluApp').service 'NodeService', NodeService
