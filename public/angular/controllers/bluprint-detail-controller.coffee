class BluprintDetailController
  constructor: ($state, $stateParams, $scope, BluprintService) ->
    @state = $state
    @stateParams = $stateParams
    @scope = $scope
    @scope.editMode = @stateParams.editMode
    @scope.importing = false
    @BluprintService = BluprintService

    @BluprintService.getBluprint(@stateParams.bluprintId)
      .then (bluprint) =>
        @scope.bluprint = bluprint
        @scope.bluprint.public = false unless bluprint.public?

  updateBluprintNow: () =>
    @scope.editMode = false
    @BluprintService.update @scope.bluprint.uuid, @scope.bluprint

  import: =>
    @scope.importing = true
    @BluprintService.importBluprint(@stateParams.bluprintId)
      .then (flow) =>
        _.delay ( =>
          @state.go('material.flow', {flowId: flow.flowId})
        ), 1000

angular.module('octobluApp').controller 'BluprintDetailController', BluprintDetailController
