angular.module('octobluApp').controller 'BrowseFlowsController', ($scope, $state, SHARED_TEMPLATES) ->
  class BrowseFlowsController
    constructor: () ->
      @flows = SHARED_TEMPLATES

      _.each @flows, (template, i) =>
          template.color = "##{i[0...6]}"

    importTemplate: (templateId) =>
      $state.go 'material.flow-import', {flowTemplateId: templateId}, {location: 'replace'}

  new BrowseFlowsController()
