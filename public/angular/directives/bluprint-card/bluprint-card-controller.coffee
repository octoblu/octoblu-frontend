class BluprintCardController
  constructor: ($scope, $state, BluprintService, NotifyService, UrlService, OCTOBLU_ICON_URL) ->
    @scope = $scope
    @state = $state
    @UrlService = UrlService
    @NotifyService = NotifyService
    @BluprintService = BluprintService

    @discover = @state.current.name == 'material.discover'

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
    @NotifyService.alert 'Share This Bluprint', url

  confirmdeleteBluprint: (bluprintId) =>
    confirm = @mdDialog.confirm()
      .content("Are you sure you want to delete this bluprint?")
      .ok("Delete")
      .cancel("Cancel")
    @NotifyService.show(confirm).then =>
      @BluprintService.deleteBluprint(bluprintId).then =>
        @state.go 'material.bluprints'


angular.module('octobluApp').controller 'BluprintCardController', BluprintCardController