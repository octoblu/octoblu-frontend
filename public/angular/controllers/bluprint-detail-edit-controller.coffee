class BluprintDetailEditController
  constructor: ($state, $stateParams, $scope, BluprintService, UrlService, NotifyService) ->
    @state           = $state
    @scope           = $scope
    @stateParams     = $stateParams
    @UrlService      = UrlService
    @BluprintService = BluprintService
    @NotifyService   = NotifyService

    { @createMode, @referrer } = @stateParams

    @BluprintService.getBluprint(@stateParams.bluprintId).then (bluprint) =>
      @bluprint = bluprint
      @scope.bluprintEdit = _.cloneDeep bluprint
      @scope.bluprintEdit.public = false unless bluprint.public?

      @scope.fragments = @generateBreadcrumbFragments()


  updateBluprintNow: =>
    @BluprintService.update(@stateParams.bluprintId, @scope.bluprintEdit).then =>
      @state.go 'material.bluprintDetail', bluprintId: @stateParams.bluprintId, referrer: @referrer

  handleCancel: =>
    if @scope.createMode
      @BluprintService.deleteBluprint(@stateParams.bluprintId).then =>
        @state.go 'material.design'

    else
      @state.go 'material.bluprintDetail', bluprintId: @stateParams.bluprintId, referrer: @referrer

  getBluprintImportUrl: (bluprintId) =>
    @UrlService.withNewPath "/bluprints/import/#{bluprintId}"

  togglePublic: (bluprint) =>
    bluprint.public = !bluprint.public
    @BluprintService.update bluprint.uuid, bluprint

  confirmdeleteBluprint: (bluprintId) =>
    confirm =
      content: "Are you sure you want to delete this bluprint?"
      ok: "Delete"
      cancel: "Cancel"

    @NotifyService.confirm(confirm).then =>
      @BluprintService.deleteBluprint(bluprintId).then =>
        return @state.go 'material.discover' if @referrer == 'discover'
        @state.go 'material.bluprints'

  generateBreadcrumbFragments: =>
    @linkTo = linkTo: 'material.bluprints', label: 'My Bluprints'
    @linkTo = linkTo: 'material.discover', label: 'Discover Bluprints' if @referrer == 'discover'

    [ @linkTo, {label: "Edit #{@scope.bluprintEdit.name}"} ]

angular.module('octobluApp').controller 'BluprintDetailEditController', BluprintDetailEditController
