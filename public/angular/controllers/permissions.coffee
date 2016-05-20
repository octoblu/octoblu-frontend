class PermissionsController
  constructor: ($stateParams, ThingService)->
    {uuid} = $stateParams
    @loading = true
    ThingService.getThing({uuid})
      .then (@thing) => @loading = false
      .catch (@error) => @loading = false


  fetchBluPrints: () =>

angular.module('octobluApp').controller 'PermissionsController', PermissionsController
