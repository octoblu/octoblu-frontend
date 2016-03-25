class BluprintDetailEditController
  constructor: ($state, $stateParams, $scope, BluprintService, UrlService, NotifyService) ->
    @state           = $state
    @scope           = $scope
    @stateParams     = $stateParams
    @UrlService      = UrlService
    @BluprintService = BluprintService
    @NotifyService   = NotifyService

    @scope.createMode = @stateParams.createMode

    @BluprintService.getBluprint(@stateParams.bluprintId).then (bluprint) =>
      @scope.bluprintEdit = _.cloneDeep bluprint
      @scope.bluprintEdit.public = false unless bluprint.public?

      @scope.fragments = @generateBreadcrumbFragments()


  updateBluprintNow: =>
    @BluprintService.update(@stateParams.bluprintId, @scope.bluprintEdit).then =>
      @state.go 'material.bluprintDetail', bluprintId: @stateParams.bluprintId

  handleCancel: =>
    if @scope.createMode
      @BluprintService.deleteBluprint(@stateParams.bluprintId).then =>
        @state.go 'material.design'

    else
      @state.go 'material.bluprintDetail', bluprintId: @stateParams.bluprintId

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
        @state.go('material.bluprints')

  generateBreadcrumbFragments: =>
    @currentRoute = @state.current.name

    @linkTo = linkTo: 'material.discover', label: 'Discover Bluprints'
    @linkTo = linkTo: 'material.bluprints', label: 'My Bluprints' if @currentRoute == 'material.bluprintEdit'

    [ @linkTo, {label: "Edit #{@scope.bluprintEdit.name}"} ]

angular.module('octobluApp').controller 'BluprintDetailEditController', BluprintDetailEditController
