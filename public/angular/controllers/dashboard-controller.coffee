class DashboardController
  constructor: ($scope, FeaturedFlows, BluprintService) ->
    @scope           = $scope
    @BluprintService = BluprintService

    @bluprints = []
    @limit = 4
    @scope.isLoading = true

    @fetchBluPrints()

  fetchBluPrints: () =>
    @BluprintService.getRecentPublic([], @limit)
      .then (bluprints) =>
        @bluprints = bluprints
        @scope.isLoading = false

  # fetchFeatured: () =>
  #   @BluprintService.featured()
  #     .then (bluprints) =>
  #       console.log bluprints


angular.module('octobluApp').controller 'DashboardController', DashboardController
