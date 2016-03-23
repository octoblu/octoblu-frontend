class ImportWizardController
  constructor: ($stateParams, $state, $scope, BluprintService) ->
    @scope = $scope
    @state = $state
    @stateParams = $stateParams
    @BluprintService = BluprintService

    @loading = true

    @BluprintService.getBluprint(@stateParams.bluprintId)
    .then (bluprint) =>
      previous = {linkTo: 'material.bluprints', label: 'My Bluprints'}
      previous = {linkTo: 'material.discover', label: 'Discover Bluprints'} if bluprint.public
      @scope.fragments = [previous, {label: "Import #{bluprint.name}"}]
      @loading = false
    .catch (error) =>
      @scope.error = error

  doIt: =>
    @goThere 'material.flowConfigure'

  notGonnaDoIt: =>
    @goThere 'material.flow'

  goThere: (route) =>
    @loading = true
    @BluprintService.importBluprint(@stateParams.bluprintId).
    then (flow) =>
      @state.go route, flowId: flow.flowId

angular.module('octobluApp').controller 'ImportWizardController', ImportWizardController
