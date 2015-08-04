class FlowImportController
  constructor: ($state, $stateParams, $scope, BluprintService) ->
    @state = $state
    @stateParams = $stateParams
    @scope = $scope
    @BluprintService = BluprintService


    @BluprintService.getBluprint(@stateParams.flowTemplateId)
      .then (bluprint) =>
        @scope.bluprint = bluprint
        @scope.bluprint.public = false unless bluprint.public?


  import: =>
    console.log "Being imported"
    @BluprintService.importBluprint(@stateParams.flowTemplateId)
      .then (flow) =>
        @scope.importing = true
        _.delay =>
          @state.go('material.flow', {flowId: flow.flowId})
        , 1000

angular.module('octobluApp').controller 'FlowImportController', FlowImportController
