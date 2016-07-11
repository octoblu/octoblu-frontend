class FlowTagsController
  constructor: ($scope, $state) ->
    @scope      = $scope

    @scope.tags = @getTags()

    @scope.$watch 'flow.nodes', =>
      @scope.tags = @getTags()

  getTags: () =>
    return unless @scope.flow.nodes?
    {nodes} = @scope.flow

    filteredTags = _.filter nodes, (node) =>
      true unless node.category == 'operation'

    mappedTags = _.map filteredTags, (tag) =>
      category = tag?.type?.split(':')[0]
      type = tag?.type?.split(':')[1]

      { category: category, type: type }

    _.take _.uniq(mappedTags, 'type'), 6

angular.module('octobluApp').controller 'FlowTagsController', FlowTagsController
