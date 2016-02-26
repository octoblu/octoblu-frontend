class BluprintSetupController
  constructor: ($mdDialog, $mdToast, $state, $stateParams, $scope, BluprintService, UrlService) ->
    @state = $state
    @scope = $scope
    @mdToast = $mdToast
    @mdDialog = $mdDialog
    @UrlService = UrlService
    @stateParams = $stateParams
    @BluprintService = BluprintService

    @import()

  refreshBluprint: =>
    @BluprintService.getBluprint(@stateParams.bluprintId)
      .then (bluprint) =>
        @scope.bluprint = bluprint
        @scope.bluprintEdit = _.cloneDeep @scope.bluprint
        @scope.bluprint.public = false unless bluprint.public?

        @scope.flowNodes = bluprint.flow?.nodes
        console.log 'Bluprint', bluprint
        console.log 'Bluprint - Flow - Nodes', @scope.flowNodes

  import: =>
    @scope.importing = true
    @BluprintService.importBluprint(@stateParams.bluprintId).
      then (flow) =>
        @scope.flow = flow
        @scope.fragments = [{label: "Setup #{flow.name}"}]
        console.log @scope.flow


angular.module('octobluApp').controller 'BluprintSetupController', BluprintSetupController
