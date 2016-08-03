{angular, _} = window

class DeviceMessageFormController
  constructor: ($q, $scope) ->
    @q = $q
    @scope = $scope
    @scope.$watch 'model', @injectRespondTo, true

  injectRespondTo: =>
    return unless @shouldResponseTo()
    _.set @scope.model, 'metadata.respondTo', {
      flowId: @scope.flowId
      nodeId: @scope.nodeId
    }

  shouldResponseTo: =>
    schemas   = _.get @scope, 'device.schemas.message'
    schema    = _.get schemas, @scope.selectedSchemaKey
    respondTo = _.get schema, 'properties.metadata.properties.respondTo'
    respondTo?

angular.module('octobluApp').controller 'DeviceMessageFormController', DeviceMessageFormController
