class RootController
  constructor: ($state) ->
    @state = $state
    @state.go('material.dashboard', {}, location: "replace")

angular.module('octobluApp').controller 'RootController', RootController
