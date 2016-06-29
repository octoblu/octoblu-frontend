{_,angular} = window

class DeviceNodeService
  constructor: ($q, NodeConversionService, ThingService) ->
    @q = $q
    @NodeConversionService = NodeConversionService
    @ThingService = ThingService

  convertFlow: (node) =>
    return node unless node.type == 'octoblu:flow' || node.type == 'device:flow'
    defaults =
      type: 'octoblu:flow'
      topic: 'flow'

    _.extend defaults, node

  convertDevice: (node) =>
    defaults =
      category: 'device'
      useStaticMessage: true

    defaults.noPayloadWrapper = node?.schemas?.version == '2.0.0'
    delete node.schemas

    _.extend defaults, node

  convert: (node) =>
    @NodeConversionService.convert @convertDevice @convertFlow node

  fetch: =>
    projection =
      uuid:     true
      name:     true
      type:     true
      logo:     true
      category: true
      online:   true
      schemas:  true
      connectorMetadata: true

    @ThingService.getThings {type: {$ne: 'octoblu:user'}}, projection
      .then (devices) =>
        promises = _.map devices, @convert
        @q.all promises

angular.module('octobluApp').service 'DeviceNodeService', DeviceNodeService
