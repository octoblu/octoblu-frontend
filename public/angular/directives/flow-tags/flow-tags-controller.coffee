class FlowTagsController
  constructor: ($scope, $state) ->
    @scope      = $scope
    @scope.tags = @getTags()

  getTags: () =>
    {nodes} = @scope.flow

    return unless nodes?

    filteredTags = _.filter nodes, (node) =>
      true unless node.category == 'operation'

    mappedTags = _.map filteredTags, (tag) =>
      category = tag.type.split(':')[0]
      type = tag.type.split(':')[1]

      { category: category, type: type }

    _.uniq mappedTags, 'type'

angular.module('octobluApp').controller 'FlowTagsController', FlowTagsController
