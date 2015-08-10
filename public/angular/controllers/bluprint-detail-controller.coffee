class BluprintDetailController
  constructor: ($mdDialog, $state, $stateParams, $scope, BluprintService) ->
    @state = $state
    @stateParams = $stateParams
    @scope = $scope
    @scope.editMode = @stateParams.editMode
    @scope.importing = false
    @BluprintService = BluprintService
    @mdDialog = $mdDialog

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

  confirmdeleteBluprint: (bluprintId) =>
    confirm = @mdDialog.confirm()
      .content("Are you sure you want to delete this bluprint?")
      .ok("Delete")
      .cancel("Cancel")
    @mdDialog.show(confirm).then =>
      @BluprintService.deleteBluprint(bluprintId).then =>
        @state.go('material.bluprints')

angular.module('octobluApp').controller 'BluprintDetailController', BluprintDetailController
