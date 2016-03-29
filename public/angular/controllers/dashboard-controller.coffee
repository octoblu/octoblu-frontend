class DashboardController
  constructor: ($scope, FeaturedFlows, BluprintService) ->
    @scope           = $scope
    @BluprintService = BluprintService

    @bluprints = []

    @limit = 4
    @page = 1

    @fetchBluPrints()


  fetchBluPrints: () =>
    @BluprintService.getPublicBluprintsPaged([], @limit, @page)
      .then (bluprints) =>
        @bluprints = bluprints

  # fetchFeatured: () =>
  #   @BluprintService.featured()
  #     .then (bluprints) =>
  #       console.log bluprints


angular.module('octobluApp').controller 'DashboardController', DashboardController
