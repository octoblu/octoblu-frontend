class DashboardController
  constructor: ($scope, FeaturedFlows, BluprintService) ->
    @scope           = $scope
    @BluprintService = BluprintService

    @bluprints = []

    @featuredflows = FeaturedFlows

    # @featuredflows = [
    #   'a8b365a1-b9a1-4e54-9c33-c30e803c7127'
    #   '28cb7562-95bc-454c-ab16-23e12d44e855'
    #   'e911ea2c-92cb-4dd4-a2ae-1a92f6c93d72'
    # ]

    @fetchBluPrints()

  fetchBluPrints: () =>
    _.forEach @featuredflows, (flowId) =>
      @BluprintService.findOne(flowId)
        .then (bluprint) =>
          @bluprints.push bluprint


angular.module('octobluApp').controller 'DashboardController', DashboardController
