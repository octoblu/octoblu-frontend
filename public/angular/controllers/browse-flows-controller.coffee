angular.module('octobluApp').controller 'BrowseFlowsController', ($scope, $state, AuthService, SHARED_TEMPLATES) ->
  class BrowseFlowsController
    constructor: () ->
      AuthService
        .getCurrentUser()
        .then (user) ->
          $scope.userUuid = user.resource.uuid

      @flows = SHARED_TEMPLATES

    importFlow: (flowId) =>
      $state.go 'material.flow-import', {flowTemplateId: flowId}, {location: 'replace'}

    liked: (flow) =>
      _.includes flow.liked_by, $scope.userUuid

    likeFlow: (flow) =>
      flow.liked_by = _.union(flow.liked_by, [$scope.userUuid])

  new BrowseFlowsController()
