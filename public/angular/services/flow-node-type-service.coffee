class FlowNodeTypeService
  constructor: ($q, UUIDService, OperationNodeService, ChannelNodeService, DeviceNodeService) ->
    @q = $q
    @UUIDService = UUIDService
    @OperationNodeService = OperationNodeService
    @ChannelNodeService = ChannelNodeService
    @DeviceNodeService = DeviceNodeService
    @getFlowNodeTypesQueue = async.queue @_getFlowNodeTypesAndCache

  createFlowNode: (flowNodeType) =>
    defaults =
      id: UUIDService.v1()
      resourceType: 'flow-node'

    _.extend defaults, flowNodeType.defaults, flowNodeType

  getFlowNodeType: (type) =>
    @getFlowNodeTypes().then (flowNodeTypes) =>
      _.findWhere flowNodeTypes, type: type

  getFlowNodeTypeByUUID: (uuid) =>
    @getFlowNodeTypes().then (flowNodeTypes) =>
      _.findWhere flowNodeTypes, uuid: uuid

  getFlowNodeTypes: =>
    return @q.when @flowNodeTypes if @flowNodeTypes?

    @q (resolve) =>
      @getFlowNodeTypesQueue.push {}, =>
        resolve @flowNodeTypes

  _fetchAndMergeTypes: =>
    @q.all
      devices: @DeviceNodeService.fetch()
      channels: @ChannelNodeService.fetch()
      operations: @OperationNodeService.fetch()
    .then ({devices, channels, operations}) =>
      _.union devices, channels, operations

  getOtherMatchingFlowNodeTypes: (type) =>
    @getFlowNodeTypes().then (flowNodeTypes) =>
      _.where flowNodeTypes, type: type

  _getFlowNodeTypesAndCache: (task, callback) =>
    return callback() if @flowNodeTypes?
    @_fetchAndMergeTypes()
      .then (@flowNodeTypes) =>
        setTimeout =>
          delete @flowNodeTypes
        , 10000
        callback()
      .catch callback

angular.module('octobluApp').service 'FlowNodeTypeService', FlowNodeTypeService
