angular.module('octobluApp').controller 'BrowseFlowsController', ($scope, $state, AuthService, TemplateService) ->
  class BrowseFlowsController
    constructor: () ->
      AuthService
        .getCurrentUser()
        .then (user) =>
          @userUuid = user.resource.uuid

      @templates = TemplateService.getPublicTemplates()
        .then (templates) =>
          @flows = templates.data


    importFlow: (flowId) =>
      $state.go 'material.flow-import', {flowTemplateId: flowId}, {location: 'replace'}

    liked: (flow) =>
      _.includes flow.liked_by, @userUuid

    toggleLike: (flow) =>
      flow.likedBy =
        if @liked(flow)
          _.without(flow.likedBy, @userUuid)
        else
          _.union(flow.likedBy, [@userUuid])

  new BrowseFlowsController()
