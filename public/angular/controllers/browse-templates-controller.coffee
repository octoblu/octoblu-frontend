angular.module('octobluApp').controller 'BrowseTemplatesController', ($scope, $state, SHARED_TEMPLATES) ->
  class BrowseTemplatesController
    constructor: () ->
      @templates = SHARED_TEMPLATES

      _.each @templates, (template, i) =>
          template.color = "##{i[0...6]}"

    importTemplate: (templateId) =>
      console.log "TEMPLATE ID #{templateId}"
      $state.go 'material.flow-import', {flowTemplateId: templateId}, {location: 'replace'}

  new BrowseTemplatesController()
