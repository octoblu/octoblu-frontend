class ChannelNodeService
  constructor: ($http, OCTOBLU_API_URL, NodeConversionService) ->
    @http = $http
    @OCTOBLU_API_URL = OCTOBLU_API_URL
    @NodeConversionService = NodeConversionService

  convertChannel: (node) =>
    defaults =
      category: 'channel'
      online: true
      useStaticMessage: true

    _.extend node, defaults

  convert: (node) =>
    @NodeConversionService.convert @convertChannel node

  fetch: =>
    @http.get "#{@OCTOBLU_API_URL}/api/user_channels"
      .then ({data}) =>
        _.map data, self.convert

angular.module('octobluApp').service 'ChannelNodeService', ChannelNodeService
