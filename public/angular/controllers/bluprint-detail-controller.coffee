class BluprintDetailController
  constructor: ($mdDialog, $mdToast, $state, $stateParams, $scope, BluprintService, UrlService) ->
    @state           = $state
    @scope           = $scope
    @mdToast         = $mdToast
    @mdDialog        = $mdDialog
    @UrlService      = UrlService
    @stateParams     = $stateParams
    @BluprintService = BluprintService

    @scope.importing  = false
    @scope.editMode   = @stateParams.editMode
    @scope.createMode = @stateParams.createMode

    @refreshBluprint()

    @scope.$watch 'editMode', () =>
      if !@scope.editMode then @scope.createMode = null
      @scope.bluprintEdit = _.cloneDeep @scope.bluprint
    , true

  refreshBluprint: =>
    @BluprintService.getBluprint(@stateParams.bluprintId)
      .then (bluprint) =>
        @scope.bluprint = bluprint
        @scope.bluprintEdit = _.cloneDeep @scope.bluprint
        @scope.bluprint.public = false unless bluprint.public?

        @linkTo = linkTo: 'material.discover', label: 'Discover Bluprints'
        if(@state.current.name == 'material.bluprintDetail')
          @linkTo = linkTo: 'material.bluprints', label: 'My Bluprints'
        @scope.fragments = [ @linkTo, {label: bluprint.name}]

  updateBluprintNow: =>
    @scope.editMode = false
    @BluprintService.update(@scope.bluprint.uuid, @scope.bluprintEdit).
      then @refreshBluprint

  handleCancel: =>
    if @scope.createMode
      @BluprintService.deleteBluprint(@stateParams.bluprintId).then =>
        @state.go('material.design')
    else
      @scope.editMode = false

  import: =>
    { bluprintId } = @stateParams
    @scope.importing = true
    @state.go 'material.bluprintWizard', bluprintId: bluprintId

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
