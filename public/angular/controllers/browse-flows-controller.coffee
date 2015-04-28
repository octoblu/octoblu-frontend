angular.module('octobluApp').controller 'BrowseFlowsController', ($scope, $state, SHARED_TEMPLATES) ->
  class BrowseFlowsController
    constructor: () ->
      @flows = SHARED_TEMPLATES

    importFlow: (flowId) =>
      $state.go 'material.flow-import', {flowTemplateId: flowId}, {location: 'replace'}

  new BrowseFlowsController()
