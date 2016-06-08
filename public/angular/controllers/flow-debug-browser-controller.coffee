class FlowDebugBrowserController
  constructor: ($scope) ->
    @scope = $scope
    @syncFromFlow()
    @edit = false

  toggleEdit: =>
    @syncFromFlow()
    @edit = !@edit

  save: =>
    @scope.flow = JSON.parse @flowText

  syncFromFlow: =>
    @flowText = JSON.stringify @scope.flow, null, 2

angular.module('octobluApp').controller 'FlowDebugBrowserController', FlowDebugBrowserController
