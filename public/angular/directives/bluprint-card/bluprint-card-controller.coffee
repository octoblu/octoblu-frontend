class BluprintCardController
  constructor: ($scope, $state, BluprintService, NotifyService, UrlService)  ->
    @scope = $scope
    @state = $state
    @UrlService = UrlService
    @NotifyService = NotifyService
    @BluprintService = BluprintService

    @scope.referrer = 'edit' if @state.current.name == 'material.bluprints'
    @scope.flow = @scope.bluprint.flow

  togglePublic: (bluprint) =>
    bluprint.public = !bluprint.public
    @BluprintService.update bluprint.uuid, bluprint

  getBluprintImportUrl: (bluprintId) =>
    @UrlService.withNewPath "/bluprints/import/#{bluprintId}"

  toastBluprintUrl: (bluprintId) =>
    url = @getBluprintImportUrl bluprintId
    message = "Copied #{url} to clipboard"
    @NotifyService.notify message

  dialogBluprintUrl: (bluprintId) =>
    url = @getBluprintImportUrl bluprintId
    @NotifyService.alert title: 'Share This Bluprint', content: url

  confirmdeleteBluprint: (bluprintId) =>
    confirm =
      content: "Are you sure you want to delete this bluprint?"
      ok: "Delete"
      cancel: "Cancel"
    @NotifyService.confirm(confirm).then =>
      @BluprintService.deleteBluprint(bluprintId).then =>
        @state.go 'material.bluprints'


angular.module('octobluApp').controller 'BluprintCardController', BluprintCardController
