{_, angular} = window

class FlowTagsController
  constructor: ($scope, $state, DeviceLogo) ->
    @scope      = $scope
    @DeviceLogo = DeviceLogo

    @scope.tags = @getTags()

    @scope.$watch 'flow.nodes', =>
      @scope.tags = @getTags()

  getTags: () =>
    return unless @scope.flow.nodes?
    {nodes} = @scope.flow

    filteredTags = _.filter nodes, (node) =>
      true unless node.category == 'operation'

    mappedTags = _.map filteredTags, (tag) =>
      {
        url: new @DeviceLogo(tag).get()
        name: tag.name
      }

    _.take _.uniq(mappedTags, 'url'), 6

angular.module('octobluApp').controller 'FlowTagsController', FlowTagsController
