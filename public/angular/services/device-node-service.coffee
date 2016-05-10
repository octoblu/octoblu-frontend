class DeviceNodeService
  constructor: (ThingService, NodeConversionService)->
    @ThingService = ThingService
    @NodeConversionService = NodeConversionService

  convertFlow: (node) =>
    return node unless node.type == 'octoblu:flow'
    defaults =
      type: 'device:flow'
      topic: 'flow'
      filterTopic: 'message'

    _.extend node, defaults

  convertDevice: (node) =>
    defaults =
      category: 'device'

    _.extend node, defaults

  convert: (node) =>
    @NodeConversionService.convert @convertDevice @convertFlow node

  fetch: =>
    projection =
      uuid:     true
      name:     true
      type:     true
      logo:     true
      category: true

    @ThingService.getThings({type: {$ne: 'octoblu:user'}}, projection).then (devices) =>
      _.map devices, self.convert

angular.module('octobluApp').service 'DeviceNodeService', DeviceNodeService
