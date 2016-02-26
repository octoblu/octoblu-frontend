class BluprintSetupController
  constructor: ($stateParams, $scope, BluprintService) ->
    @scope = $scope
    @stateParams = $stateParams
    @BluprintService = BluprintService

    @import()

  import: =>
    @scope.importing = true
    @BluprintService.importBluprint(@stateParams.bluprintId).
      then (flow) =>
        @scope.flow = flow
        @scope.fragments = [{label: "Setup #{flow.name}"}]


angular.module('octobluApp').controller 'BluprintSetupController', BluprintSetupController
