class BluprintDetailController
  constructor: ($mdDialog, $mdToast, $state, $stateParams, $scope, BluprintService, UrlService) ->
    @state = $state
    @scope = $scope
    @mdToast = $mdToast
    @mdDialog = $mdDialog
    @UrlService = UrlService
    @stateParams = $stateParams
    @BluprintService = BluprintService

    @scope.importing = false
    @scope.editMode = @stateParams.editMode

    @refreshBluprint()

    @scope.$watch 'editMode', () =>
      @scope.bluprintEdit = _.cloneDeep @scope.bluprint
    , true

  refreshBluprint: =>
    @BluprintService.getBluprint(@stateParams.bluprintId)
      .then (bluprint) =>
        @scope.bluprint = bluprint
        @scope.bluprintEdit = _.cloneDeep @scope.bluprint
        @scope.bluprint.public = false unless bluprint.public?

  updateBluprintNow: =>
    @scope.editMode = false
    @BluprintService.update(@scope.bluprint.uuid, @scope.bluprintEdit).
      then @refreshBluprint

  import: =>
    @scope.importing = true
    @BluprintService.importBluprint(@stateParams.bluprintId).
      then (flow) =>
        _.delay ( =>
          @state.go('material.flow', {flowId: flow.flowId})
        ), 1000

  togglePublic: (bluprint) =>
    bluprint.public = !bluprint.public
    @BluprintService.update bluprint.uuid, bluprint

  getBluprintImportUrl: (bluprintId) =>
    @UrlService.withNewPath "/bluprints/import/#{bluprintId}"

  toastBluprintUrl: (bluprintId) =>
    url = @getBluprintImportUrl bluprintId
    message = "Copied #{url} to clipboard"
    @mdToast.show @mdToast.simple(position: 'top right').content message

  dialogBluprintUrl: (bluprintId) =>
    url = @getBluprintImportUrl bluprintId
    alert = @mdDialog.alert()
      .content url
      .title 'Share this bluprint'
      .ok 'OKAY'
    @mdDialog.show(alert).
      finally =>
        alert = undefined

  confirmdeleteBluprint: (bluprintId) =>
    confirm = @mdDialog.confirm()
      .content("Are you sure you want to delete this bluprint?")
      .ok("Delete")
      .cancel("Cancel")
    @mdDialog.show(confirm).then =>
      @BluprintService.deleteBluprint(bluprintId).then =>
        @state.go('material.bluprints')

angular.module('octobluApp').controller 'BluprintDetailController', BluprintDetailController
