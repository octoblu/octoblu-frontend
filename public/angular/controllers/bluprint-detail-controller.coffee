class BluprintDetailController
  constructor: ($state, $stateParams, $scope, BluprintService) ->
    @state = $state
    @stateParams = $stateParams
    @scope = $scope
    @BluprintService = BluprintService

    @BluprintService.getBluprint(@stateParams.bluprintId)
      .then (bluprint) =>
        @scope.bluprint = bluprint
        @scope.bluprint.public = false unless bluprint.public?


  updateBluprintNow: () =>
    @scope.editMode = false
    @BluprintService.update @scope.bluprint.uuid, @scope.bluprint

  import: =>
    @BluprintService.importBluprint(@stateParams.bluprintId)
      .then (flow) =>
        @scope.importing = true
        _.delay =>
          @state.go('material.flow', {flowId: flow.flowId})
        , 1000

angular.module('octobluApp').controller 'BluprintDetailController', BluprintDetailController
