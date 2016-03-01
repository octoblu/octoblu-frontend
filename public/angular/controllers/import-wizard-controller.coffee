class ImportWizardController
  constructor: ($stateParams, $state, $scope, BluprintService) ->
    @scope = $scope
    @state = $state
    @stateParams = $stateParams
    @BluprintService = BluprintService

    @BluprintService.importBluprint(@stateParams.bluprintId).
      then (flow) =>
        @scope.flow = flow
        @scope.fragments = [{label: "Flow Wizard"}]

  doIt: =>
    @goThere 'material.flowConfigure'

  notGonnaDoIt: =>
    @goThere 'material.flow'

  goThere: (route) =>
    @state.go route, flowId: @scope.flow.flowId

angular.module('octobluApp').controller 'ImportWizardController', ImportWizardController
