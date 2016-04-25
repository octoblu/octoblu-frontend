class BluprintDetailController
  constructor: ($state, $stateParams, $scope, $cookies, BluprintService, UrlService, NotifyService) ->
    @state           = $state
    @scope           = $scope
    @cookies         = $cookies
    @stateParams     = $stateParams
    @UrlService      = UrlService
    @BluprintService = BluprintService
    @NotifyService   = NotifyService

    { @referrer } = @stateParams

    @BluprintService.getBluprint(@stateParams.bluprintId).then (bluprint) =>
      @scope.bluprint = bluprint
      @scope.bluprint.ownerName = _.capitalize @scope.bluprint.ownerName
      @scope.bluprint.public = false unless bluprint.public?

      @generateShareUrls(bluprint)

      @scope.fragments = [{linkTo: 'material.bluprints', label: 'Bluprints'}, { label: 'Detail' }]

  import: =>
    { bluprintId } = @stateParams
    @state.go 'material.bluprintWizard', bluprintId: bluprintId

  getBluprintImportUrl: (bluprintId) =>
    @UrlService.withNewPath "/bluprints/import/#{bluprintId}"

  toastBluprintUrl: (bluprintId) =>
    message = "Copied #{@getBluprintImportUrl bluprintId} to clipboard"
    @NotifyService.notify message

  dialogBluprintUrl: (bluprintId) =>
    url = @getBluprintImportUrl bluprintId
    @NotifyService.alert title: 'Share This Bluprint', content: url

  generateShareUrls: (bluprint) =>
    @shareUrl = @getBluprintImportUrl bluprint.uuid

    @twitterUrl = "https://twitter.com/intent/tweet?text=Check%20Out%20This%20Awesome%20Bluprint%20-%20#{bluprint.name}%20-%20#{@shareUrl} via @Octoblu"
    @facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=#{@shareUrl}"
    @emailUrl = "mailto:?subject=#{encodeURIComponent(bluprint.name)}&body=#{encodeURIComponent("Check out #{bluprint.name} on Octoblu #{@shareUrl}")}"

angular.module('octobluApp').controller 'BluprintDetailController', BluprintDetailController
