angular.module('octobluApp').controller 'SharedBluprintsController', ($scope, $mdToast, $state, $stateParams, AuthService, BluprintService) ->
  class SharedBluprintsController
    constructor: () ->
      @luckyRobotNumber = Math.round(1 + Math.random() * 9)
      $scope.isLoading = true;
      @collectionName = $stateParams.collection
      AuthService.getCurrentUser().then (user) =>
        @userUuid = user.resource.uuid

      @refreshBlueprints()

    refreshBlueprints: =>
      BluprintService.getPublicBluprints(@collectionName)
        .then (bluprints) =>
          @bluprints = bluprints
          $scope.isLoading = false;

    importBluprint: (bluprintId) =>
      $state.go 'material.flow-import', {flowTemplateId: bluprintId}

    liked: (bluprint) =>
      _.includes bluprint.likedBy, @userUuid

    toggleLike: (bluprint) =>
      bluprint.likedBy =
        if @liked(bluprint)
          _.without(bluprint.likedBy, @userUuid)
        else
          _.union(bluprint.likedBy, [@userUuid])

      @updateBlueprint(bluprint)

    toastBluprintUrl: (url) =>
      message = "Copied #{url} to clipboard"
      $mdToast.show $mdToast.simple(position: 'top right').content message

    dialogBluprintUrl: (url) =>
      alert = $mdDialog.alert().content(url).title('Share this bluprint').ok 'OKAY'
      $mdDialog.show(alert).finally =>
        alert = undefined

    updateBlueprint: (newBlueprint) =>
      BluprintService.update newBlueprint.uuid, newBlueprint

    randomRobot: () =>
      "/assets/images/robots/robot#{@luckyRobotNumber}.png"

  new SharedBluprintsController()
