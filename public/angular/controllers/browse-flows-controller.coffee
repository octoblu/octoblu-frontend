angular.module('octobluApp').controller 'BrowseFlowsController', ($scope, $state, AuthService, TemplateService) ->
  class BrowseFlowsController
    constructor: () ->
      AuthService
        .getCurrentUser()
        .then (user) =>
          @userUuid = user.resource.uuid

      @refreshBlueprints()

    refreshBlueprints: =>
      TemplateService.getPublicTemplates()
        .then (templates) =>
          @flows = templates.data

    importFlow: (flowId) =>
      $state.go 'material.flow-import', {flowTemplateId: flowId}

    liked: (flow) =>
      _.includes flow.likedBy, @userUuid

    toggleLike: (flow) =>
      flow.likedBy =
        if @liked(flow)
          _.without(flow.likedBy, @userUuid)
        else
          _.union(flow.likedBy, [@userUuid])

      @updateBlueprint(flow)

    updateBlueprint: (newBlueprint) =>
      TemplateService.update newBlueprint.uuid, newBlueprint

  new BrowseFlowsController()
