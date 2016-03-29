class DashboardController
  constructor: ($scope, FeaturedFlows, BluprintService) ->
    @scope           = $scope
    @BluprintService = BluprintService

    @bluprints = []
    @featuredflows = FeaturedFlows

    @fetchBluPrints()

  fetchBluPrints: () =>
    _.forEach @featuredflows, (flowId) =>
      @BluprintService.findOne(flowId)
        .then (bluprint) =>
          @bluprints.push bluprint


angular.module('octobluApp').controller 'DashboardController', DashboardController
