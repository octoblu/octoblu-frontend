class ImportWizardController
  constructor: ($stateParams, $state, $scope, BluprintService) ->
    @scope           = $scope
    @state           = $state
    @stateParams     = $stateParams
    @BluprintService = BluprintService
    @loading         = true

    {@bluprintId} = @stateParams

    @BluprintService.getBluprint(@bluprintId)
      .then (bluprint) =>
        @scope.fragments = @getBreadcrumbFragments bluprint
        @loading = false
      .catch (error) =>
        @scope.error = error

  doIt: =>
    @goThere 'material.flowConfigure'

  notGonnaDoIt: =>
    @goThere 'material.flow'

  goThere: (route) =>
    @loading = false
    @BluprintService.importBluprint(@bluprintId).then (flow) =>
      @state.go route, flowId: flow.flowId

  getBreadcrumbFragments: (bluprint) =>
    {name, uuid} = bluprint

    bluprintsIndexFragment =
      label: 'Bluprints'
      linkTo: 'material.bluprints'

    detailFragment =
      label: name
      linkTo: 'material.bluprintDetail'
      params:
        bluprintId: uuid

    [ bluprintsIndexFragment, detailFragment, label: "Import" ]


angular.module('octobluApp').controller 'ImportWizardController', ImportWizardController
