class OctoService
  constructor: ($q) ->
    @q = $q

  list: =>
    @q.reject(new Error('not yet implemented'))

angular.module('octobluApp').service 'OctoService', OctoService
