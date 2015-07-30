class FlowDetailEditorController
  constructor: ($scope) ->
    @scope = $scope

  createBluprint: (flow) ->
    console.log 'Create Bluprint', flow

  deleteFlow: (flow) ->
    console.log 'Delete Flow', flow

angular.module('octobluApp').controller 'FlowDetailEditorController', FlowDetailEditorController
