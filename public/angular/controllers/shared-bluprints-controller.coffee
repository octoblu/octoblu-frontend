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

    @bluprints = []
    @scope.isLoading = true

    @AuthService.getCurrentUser().then (user) =>
      @userUuid = user.resource.uuid

    @limitPerPage = 9
    @currentPage  = 1
    @noneLeft     = true

    @refreshBluprintsPaged(@limitPerPage,@currentPage)
    @scope.$watch 'bluprintNameFilter', (oldVal, newVal) =>
      @scope.bluprintNameFilter = @scope.bluprintNameFilter || ''
      @searchPublic(@scope.bluprintNameFilter) unless @scope.bluprintNameFilter.length == 0
      @refreshBluprintsPaged(9, 1) if @scope.bluprintNameFilter.length == 0


  searchPublic: (name)=>
    @BluprintService.getPublicBluprintsNameFilter(@collectionName, name)
      .then (bluprints) =>
        @bluprints = bluprints
        @noneLeft = true
        @scope.isLoading = false

  refreshLimit: =>
    @refreshBluprintsPaged(@limitPerPage,@currentPage)

  showMore: =>
    @currentPage = @currentPage + 1
    @BluprintService.getPublicBluprintsPaged(@collectionName, @limitPerPage, @currentPage)
      .then (bluprints) =>
        @bluprints = @bluprints.concat(bluprints)
        @noneLeft = true if _.size(bluprints) < @limitPerPage
        @scope.isLoading = false

  refreshBluprintsPaged: (limit, page)=>
    @BluprintService.getPublicBluprintsPaged(@collectionName, limit, page)
      .then (bluprints) =>
        @bluprints = bluprints
        @noneLeft = false unless _.size(bluprints) < @limitPerPage
        @scope.isLoading = false

angular.module('octobluApp').controller 'SharedBluprintsController', SharedBluprintsController
