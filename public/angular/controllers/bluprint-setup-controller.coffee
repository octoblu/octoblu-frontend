class BluprintSetupController
  constructor: ($mdDialog, $mdToast, $state, $stateParams, $scope, BluprintService, UrlService) ->
    @state = $state
    @scope = $scope
    @mdToast = $mdToast
    @mdDialog = $mdDialog
    @UrlService = UrlService
    @stateParams = $stateParams
    @BluprintService = BluprintService

    @refreshBluprint()

  refreshBluprint: =>
    @BluprintService.getBluprint(@stateParams.bluprintId)
      .then (bluprint) =>
        @scope.bluprint = bluprint
        @scope.bluprintEdit = _.cloneDeep @scope.bluprint
        @scope.bluprint.public = false unless bluprint.public?

        @scope.flowNodes = bluprint.flow?.nodes
        console.log 'Bluprint', bluprint
        console.log 'Bluprint - Flow - Nodes', @scope.flowNodes

        @linkTo = linkTo: 'material.discover', label: 'Discover Bluprints'
        if(@state.current.name == 'material.bluprintDetail')
          @linkTo = linkTo: 'material.bluprints', label: 'My Bluprints'
        @scope.fragments = [ @linkTo, {label: bluprint.name}]

  import: =>
    @scope.importing = true
    @BluprintService.importBluprint(@stateParams.bluprintId).
      then (flow) =>
        _.delay ( =>
          @state.go('material.flow', {flowId: flow.flowId})
        ), 1000


angular.module('octobluApp').controller 'BluprintSetupController', BluprintSetupController
