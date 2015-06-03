class FlowDetailEditorController
  constructor: ($scope) ->
    @scope = $scope

  deleteFlow: (flow) =>
    @scope.$emit('delete-flow', flow);

angular.module('octobluApp').controller 'FlowDetailEditorController', FlowDetailEditorController
