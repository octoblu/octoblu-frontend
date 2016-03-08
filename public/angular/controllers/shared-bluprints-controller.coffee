class SharedBluprintsController
  constructor: ($scope, $mdDialog, $mdToast, $state, $stateParams, AuthService, BluprintService, UrlService) ->
    @scope           = $scope
    @state           = $state
    @mdToast         = $mdToast
    @mdDialog        = $mdDialog
    @stateParams     = $stateParams

    @UrlService      = UrlService
    @AuthService     = AuthService
    @BluprintService = BluprintService

    @sortLikedBy = {}
    @bluprints = []
    @scope.isLoading = true
    @scope.sortMethod = '-sortLikedBy.length'
    @scope.sortMethods =
      '-sortLikedBy.length': 'Top Liked'
      'name': 'Alphabetical (ascending)'
      '-name': 'Alphabetical (descending)'

    @collectionName = $stateParams.collection
    @AuthService.getCurrentUser().then (user) =>
      @userUuid = user.resource.uuid

    @limitPerPage = 10
    @currentPage  = 1
    @noneLeft     = true

    @refreshBluprintsPaged(@limitPerPage,@currentPage)
    @scope.$watch 'bluprintNameFilter', (oldVal, newVal) =>
      @scope.bluprintNameFilter = @scope.bluprintNameFilter || ''
      @searchPublic(@scope.bluprintNameFilter) unless @scope.bluprintNameFilter.length == 0
      @refreshBluprintsPaged(10, 1) if @scope.bluprintNameFilter.length == 0


  refreshBluprints: =>
    @BluprintService.getPublicBluprints(@collectionName)
      .then (bluprints) =>
        @bluprints = bluprints
        @editSortBy @bluprints
        @scope.isLoading = false

  searchPublic: (name)=>
    @BluprintService.getPublicBluprintsNameFilter(@collectionName, name)
      .then (bluprints) =>
        @bluprints = bluprints
        @noneLeft = true
        @editSortBy @bluprints
        @scope.isLoading = false

  refreshLimit: =>
    @refreshBluprintsPaged(@limitPerPage,@currentPage)

  showMore: =>
    @currentPage = @currentPage + 1
    @BluprintService.getPublicBluprintsPaged(@collectionName, @limitPerPage, @currentPage)
      .then (bluprints) =>
        @bluprints = @bluprints.concat(bluprints)
        @noneLeft = true if _.size(bluprints) < @limitPerPage
        @editSortBy @bluprints
        @scope.isLoading = false

  refreshBluprintsPaged: (limit, page)=>
    @BluprintService.getPublicBluprintsPaged(@collectionName, limit, page)
      .then (bluprints) =>
        @bluprints = bluprints
        @noneLeft = false unless _.size(bluprints) < @limitPerPage
        @editSortBy @bluprints
        @scope.isLoading = false

  importBluprint: (bluprintId) =>
    @BluprintService.importBluprint(bluprintId).then (flow) =>
      @scope.importing = true
      _.delay ( -> @state.go 'material.flow', flowId: flow.flowId), 1000

  editSortBy: (bluprints) =>
    return _.each @bluprints, (bluprint) =>
      @sortLikedBy[bluprint.uuid] ?= bluprint.likedBy
      bluprint.sortLikedBy = @sortLikedBy[bluprint.uuid]

  liked: (bluprint) =>
    _.includes bluprint.likedBy, @userUuid

  toggleLike: (bluprint) =>
    @BluprintService.toggleLike(@userUuid, bluprint).then => @refreshBluprints()

  getBluprintImportUrl: (bluprintId) =>
    @UrlService.withNewPath "/bluprints/import/#{bluprintId}"

  toastBluprintUrl: (bluprintId) =>
    url = @getBluprintImportUrl bluprintId
    message = "Copied #{url} to clipboard"
    @mdToast.show @mdToast.simple(position: 'top right').content message

  dialogBluprintUrl: (bluprintId) =>
    url = @getBluprintImportUrl bluprintId
    alert = @mdDialog.alert().content(url).title('Share this bluprint').ok 'OKAY'
    @mdDialog.show(alert).finally =>
      alert = undefined



angular.module('octobluApp').controller 'SharedBluprintsController', SharedBluprintsController
