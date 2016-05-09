class FlowDebugBrowserController
  constructor: ($scope) ->
    @scope = $scope
    @syncFromFlow()
    @edit = false

  toggleEdit: =>
    @syncFromFlow()
    @edit = !@edit

  save: =>
    newFlow = JSON.parse @flowText
    angular.copy newFlow, @scope.flow

  syncFromFlow: =>
    @flowText = JSON.stringify @scope.flow, null, 2

angular.module('octobluApp').controller 'FlowDebugBrowserController', FlowDebugBrowserController
