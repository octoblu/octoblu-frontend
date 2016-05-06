class HttpBodyController
  constructor: ($scope) ->
    @scope = $scope

    @scope.bodySchema = {
      type: 'object'
      properties: {}
    }

    @scope.bodyModel = @bodyKeysToJson()

    @scope.$watch 'showJsonEditor', (val) =>
      if val == true
        @scope.bodyModel = @bodyKeysToJson()

  save: () =>
    @jsonToBodyKeys()

  bodyKeysToJson: () =>
    {bodyKeys, bodyValues} = @scope.flowNode
    return {} unless bodyValues?
    bodyModel = {}
    _.each bodyKeys, (key, index) =>
       bodyModel[key] = bodyValues[index]

    return bodyModel

  jsonToBodyKeys: () =>
    @scope.flowNode.bodyKeys = _.keys @scope.bodyModel
    @scope.flowNode.bodyValues = _.values @scope.bodyModel


angular.module('octobluApp').controller 'HttpBodyController', HttpBodyController
